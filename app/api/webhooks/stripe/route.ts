import { NextResponse } from "next/server";
import Stripe from "stripe";
import { query } from "@/lib/d1";

let stripeInstance: Stripe | null = null;
function getStripe(): Stripe {
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: "2026-03-25.dahlia",
    });
  }
  return stripeInstance;
}

function generateLicenseKey(productSlug: string): string {
  const prefix = productSlug.slice(0, 4).toUpperCase();
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  const random = Array.from(bytes)
    .map((b) => b.toString(36).padStart(2, "0"))
    .join("")
    .slice(0, 8)
    .toUpperCase();
  return `EVTL-${prefix}-${random}`;
}

export async function POST(request: Request) {
  const body = await request.text();
  const sig  = request.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error("Webhook signature failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { customerEmail, customerName, productSlug, productName } = session.metadata ?? {};
    const licenseKey = generateLicenseKey(productSlug ?? "EVTL");
    const now        = new Date().toISOString();
    const orderId    = crypto.randomUUID();

    console.log("Payment succeeded:", { customerEmail, productName, licenseKey });

    try {
      await query(
        `INSERT INTO "Order"
           (id, stripeSessionId, customerEmail, customerName, productSlug, productName,
            amount, currency, status, licenseKey, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'completed', ?, ?, ?)`,
        [
          orderId,
          session.id,
          customerEmail ?? "",
          customerName ?? "",
          productSlug  ?? "",
          productName  ?? "",
          session.amount_total ?? 0,
          session.currency ?? "eur",
          licenseKey,
          now, now,
        ]
      );

      await query(
        `INSERT INTO License
           (id, key, orderId, productSlug, productName, customerEmail, status, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, 'active', ?, ?)`,
        [
          crypto.randomUUID(),
          licenseKey,
          orderId,
          productSlug ?? "",
          productName ?? "",
          customerEmail ?? "",
          now, now,
        ]
      );

      const { sendLicenseEmail } = await import("@/lib/email");
      await sendLicenseEmail({
        to: customerEmail ?? "",
        customerName: customerName ?? "Customer",
        productName: productName ?? "EV Trading Labs",
        licenseKey,
        orderId: `EVTL-${session.id.slice(-8).toUpperCase()}`,
      });

    } catch (err) {
      console.error("Webhook DB/email error:", err);
    }

  } else if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    try {
      await query(
        `UPDATE "Order" SET status = 'expired', updatedAt = ? WHERE stripeSessionId = ?`,
        [new Date().toISOString(), session.id]
      );
    } catch {
      // session may not exist yet
    }
  }

  return NextResponse.json({ received: true });
}
