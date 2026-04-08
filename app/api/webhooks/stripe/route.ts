import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { sendLicenseEmail } from "@/lib/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2026-03-25.dahlia",
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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { customerEmail, customerName, productSlug, productName } = session.metadata || {};
    const orderId = session.id;

    const licenseKey = generateLicenseKey(productSlug || "EVTL");

    console.log("=== PAYMENT SUCCEEDED ===");
    console.log("Email:", customerEmail);
    console.log("Product:", productName);
    console.log("Order ID:", orderId);
    console.log("License Key:", licenseKey);
    console.log("=========================");

    // Save order to database
    try {
      const order = await prisma.order.create({
        data: {
          stripeSessionId: orderId,
          customerEmail: customerEmail || "",
          customerName: customerName || "",
          productSlug: productSlug || "",
          productName: productName || "",
          amount: session.amount_total || 0,
          currency: session.currency || "eur",
          status: "completed",
          licenseKey,
        },
      });

      // Create license
      await prisma.license.create({
        data: {
          key: licenseKey,
          orderId: order.id,
          productSlug: productSlug || "",
          productName: productName || "",
          customerEmail: customerEmail || "",
          status: "active",
        },
      });

      console.log("Order saved to DB:", order.id);

      // Send email with license key
      await sendLicenseEmail({
        to: customerEmail || "",
        customerName: customerName || "Customer",
        productName: productName || "EV Trading Labs Product",
        licenseKey,
        orderId: `EVTL-${orderId.slice(-8).toUpperCase()}`,
      });

    } catch (dbError) {
      console.error("Database error:", dbError);
    }

  } else if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log("Checkout session expired:", session.id);
    
    // Mark order as expired
    try {
      await prisma.order.update({
        where: { stripeSessionId: session.id },
        data: { status: "expired" },
      });
    } catch (e) {
      // Session might not exist in DB yet
    }
  }

  return NextResponse.json({ received: true });
}
