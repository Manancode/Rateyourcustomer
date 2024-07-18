import { stripe } from "@/app/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";
import prisma from "@/app/lib/db";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );
      const customerId = String(session.customer);

      const user = await prisma.user.findUnique({
        where: {
          stripeCustomerid: customerId,
        },
      });

      if (!user) {
        throw new Error("User not found...");
      }

      await prisma.subscription.create({
        data: {
          stripeSubscriptionid: subscription.id,
          userid: user.id,
          currentperiodstart: subscription.current_period_start,
          currentperiodend: subscription.current_period_end,
          status: subscription.status,
          planid: subscription.items.data[0].price.id,
          interval: String(subscription.items.data[0].plan.interval),
          apikey: "secret_" + randomUUID(), // Generate API key on subscription creation
        },
      });
    }

    if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId = invoice.subscription as string;

      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      const existingSubscription = await prisma.subscription.findUnique({
        where: {
          stripeSubscriptionid: subscription.id,
        },
      });

      if (!existingSubscription) {
        // If the subscription does not exist, create it
        const customerId = subscription.customer as string;
        const user = await prisma.user.findUnique({
          where: {
            stripeCustomerid: customerId,
          },
        });

        if (!user) {
          throw new Error("User not found...");
        }

        await prisma.subscription.create({
          data: {
            stripeSubscriptionid: subscription.id,
            userid: user.id,
            currentperiodstart: subscription.current_period_start,
            currentperiodend: subscription.current_period_end,
            status: subscription.status,
            planid: subscription.items.data[0].price.id,
            interval: String(subscription.items.data[0].plan.interval),
            apikey: "secret_" + randomUUID(), // Generate API key if creating the subscription
          },
        });
      } else {
        // If the subscription exists, update it
        await prisma.subscription.update({
          where: {
            stripeSubscriptionid: subscription.id,
          },
          data: {
            planid: subscription.items.data[0].price.id,
            currentperiodstart: subscription.current_period_start,
            currentperiodend: subscription.current_period_end,
            status: subscription.status,
            // Do not generate a new API key here
          },
        });
      }
    }

    return new Response(null, { status: 200 });
  } catch (error: unknown) {
    console.error(error);
    return new Response("webhook error", { status: 400 });
  }
}
