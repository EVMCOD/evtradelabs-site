import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2025-02-24.acacia",
});

const PRODUCT_PRICES: Record<string, { amount: number; name: string }> = {
  "ev-quant-lab": { amount: 9999, name: "EV Quant Lab (mes)" },
  "master-of-liquidity": { amount: 4899, name: "Master of Liquidity (mes)" },
  "replicador": { amount: 1899, name: "Replicador (mes)" },
  "local-app": { amount: 7900, name: "Local App" },
};

export async function POST(request: Request) {
  try {
    const { productSlug, email, name, country } = await request.json();

    if (!productSlug || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const price = PRODUCT_PRICES[productSlug];
    if (!price) {
      return NextResponse.json({ error: "Invalid product" }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: price.amount,
      currency: "eur",
      metadata: {
        productSlug,
        productName: price.name,
        customerEmail: email,
        customerName: name || "",
        country: country || "",
      },
      receipt_email: email,
      description: `EV Trading Labs — ${price.name}`,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: price.amount,
    });
  } catch (error: any) {
    console.error("Stripe error:", error.message);
    return NextResponse.json(
      { error: error.message || "Payment processing error" },
      { status: 500 }
    );
  }
}
