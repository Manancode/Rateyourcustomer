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
          planid: subscription.items.data[0].plan.id,
          interval: String(subscription.items.data[0].plan.interval),
        },
      });
    }

    if (event.type === "invoice.payment_succeeded") {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );

      await prisma.subscription.update({
        where: {
          stripeSubscriptionid: subscription.id,
        },
        data: {
          planid: subscription.items.data[0].price.id,
          currentperiodstart: subscription.current_period_start,
          currentperiodend: subscription.current_period_end,
          status: subscription.status,
          apikey : "secret_" + randomUUID()
        },
      });
    }

    return new Response(null, { status: 200 });
  } catch (error: unknown) {
    console.error(error);
    return new Response("webhook error", { status: 400 });
  }
}