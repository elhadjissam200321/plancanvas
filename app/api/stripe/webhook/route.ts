import { NextResponse } from "next/server";
import Stripe from "stripe";

// Mark as dynamic to prevent build-time execution
export const dynamic = "force-dynamic";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });
}

function getSupabaseAdmin() {
  const { createClient } = require("@supabase/supabase-js");
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature")!;

  const stripe = getStripe();
  const supabaseAdmin = getSupabaseAdmin();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.supabase_user_id;
      if (userId && session.subscription) {
        await supabaseAdmin
          .from("profiles")
          .update({
            plan: "premium",
            stripe_subscription_id: session.subscription as string,
            subscription_status: "active",
          })
          .eq("id", userId);
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const customer = (await stripe.customers.retrieve(
        subscription.customer as string
      )) as Stripe.Customer;
      const userId = customer.metadata?.supabase_user_id;

      if (userId) {
        const isActive = subscription.status === "active";
        await supabaseAdmin
          .from("profiles")
          .update({
            plan: isActive ? "premium" : "free",
            subscription_status: subscription.status,
          })
          .eq("id", userId);
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customer = (await stripe.customers.retrieve(
        subscription.customer as string
      )) as Stripe.Customer;
      const userId = customer.metadata?.supabase_user_id;

      if (userId) {
        await supabaseAdmin
          .from("profiles")
          .update({
            plan: "free",
            stripe_subscription_id: null,
            subscription_status: "canceled",
          })
          .eq("id", userId);
      }
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customer = (await stripe.customers.retrieve(
        invoice.customer as string
      )) as Stripe.Customer;
      const userId = customer.metadata?.supabase_user_id;

      if (userId) {
        await supabaseAdmin
          .from("profiles")
          .update({ subscription_status: "past_due" })
          .eq("id", userId);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
