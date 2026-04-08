import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.log("Missing stripe signature or webhook secret");
    return NextResponse.json({ received: true });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const { customerEmail, customerName, productSlug, productName } = paymentIntent.metadata;

    console.log("=== PAYMENT SUCCEEDED ===");
    console.log("Email:", customerEmail);
    console.log("Product:", productName);
    console.log("Order ID:", paymentIntent.id);
    console.log("Amount:", paymentIntent.amount);
    console.log("============================");

    // TODO: Generate license key and save to database
    // TODO: Send email with license key using Resend
    // TODO: Create order record in Prisma

  } else if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    console.log("Payment failed:", paymentIntent.id, paymentIntent.last_payment_error?.message);
  }

  return NextResponse.json({ received: true });
}
