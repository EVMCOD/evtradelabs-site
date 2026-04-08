import { NextResponse } from "next/server";
import Stripe from "stripe";
import { sendLicenseEmail } from "../../email/route";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2025-02-24.acacia",
});

function generateLicenseKey(productSlug: string): string {
  const prefix = productSlug.slice(0, 4).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `EVTL-${prefix}-${random}`;
}

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

    const licenseKey = generateLicenseKey(productSlug || "EVTL");
    const orderId = paymentIntent.id;

    console.log("=== PAYMENT SUCCEEDED ===");
    console.log("Email:", customerEmail);
    console.log("Product:", productName);
    console.log("Order ID:", orderId);
    console.log("License Key:", licenseKey);
    console.log("Amount:", paymentIntent.amount);
    console.log("============================");

    // TODO: Save license to database (Prisma)
    // TODO: Create order record in Prisma
    // Send email with license key
    await sendLicenseEmail({
      to: customerEmail || "demo@example.com",
      customerName: customerName || "Customer",
      productName: productName || "EV Trading Labs Product",
      licenseKey,
      orderId: `EVTL-${orderId.slice(-8).toUpperCase()}`,
    });

  } else if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    console.log("Payment failed:", paymentIntent.id, paymentIntent.last_payment_error?.message);
  }

  return NextResponse.json({ received: true });
}
