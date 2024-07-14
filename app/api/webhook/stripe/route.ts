import prisma from "@/app/lib/db";
import { stripe } from "@/app/lib/stripe";
import { randomUUID } from "crypto";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error: unknown) {
    console.error("Webhook error:", (error as Error).message);
    return new Response("Webhook error: " + (error as Error).message, { status: 400 });
  }

  console.log("Received event:", event);

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutSessionCompleted(session);
      break;

    case "invoice.payment_succeeded":
      const invoice = event.data.object as Stripe.Invoice;
      await handleInvoicePaymentSucceeded(invoice);
      break;

    default:
      console.warn(`Unhandled event type: ${event.type}`);
  }

  return new Response(null, { status: 200 });
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    const customerId = String(session.customer);

    const user = await prisma.user.findUnique({
      where: {
        stripeCustomerid: customerId,
      }
    });

    if (!user) {
      console.error("User not found for customer ID:", customerId);
      throw new Error("User not found.");
    }

    await prisma.subscription.create({
      data: {
        stripeSubscriptionid: subscription.id,
        userid: user.id,
        currentperiodstart: subscription.current_period_start,
        currentperiodend: subscription.current_period_end,
        status: subscription.status,
        planid: subscription.items.data[0].plan.id,
        interval: String(subscription.items.data[0].plan.interval),
      }
    });

    console.log("Subscription created successfully for user ID:", user.id);
  } catch (error) {
    console.error("Error handling checkout.session.completed:", error);
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    const subscription = await stripe.subscriptions.retrieve(
      invoice.subscription as string
    );
   
    await prisma.subscription.updateMany({
      where: {
        stripeSubscriptionid: subscription.id,
      },
      data: {
        planid: subscription.items.data[0].price.id,
        currentperiodstart: subscription.current_period_start,
        currentperiodend: subscription.current_period_end,
        status: subscription.status ,
        apikey : "secret_" + randomUUID()
      }
    });
    

    console.log("Subscription updated successfully for subscription ID:", subscription.id);
  } catch (error) {
    console.error("Error handling invoice.payment_succeeded:", error);
  }
}
