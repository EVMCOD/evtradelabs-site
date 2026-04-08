import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2025-02-24.acacia",
});

const PRODUCT_PRICES: Record<string, { amount: number; name: string }> = {
  "ev-quant-lab": { amount: 9999, name: "EV Quant Lab (mensual)" },
  "master-of-liquidity": { amount: 4899, name: "Master of Liquidity (mensual)" },
  "replicador": { amount: 1899, name: "Replicador (mensual)" },
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

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: price.amount,
            product_data: {
              name: `EV Trading Labs — ${price.name}`,
              description: "Licencia de uso para MetaTrader 5",
              metadata: {
                productSlug,
                productName: price.name,
                customerName: name || "",
                country: country || "",
              },
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        productSlug,
        productName: price.name,
        customerEmail: email,
        customerName: name || "",
        country: country || "",
      },
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout?product=${productSlug}&canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Checkout error:", error.message);
    return NextResponse.json(
      { error: error.message || "Checkout error" },
      { status: 500 }
    );
  }
}
