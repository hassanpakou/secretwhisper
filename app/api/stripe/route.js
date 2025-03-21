import Stripe from "stripe";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const { amount, messageId } = await request.json();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: "Révéler l’expéditeur" },
          unit_amount: amount || 100, // 1.00 USD
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${request.headers.get("origin")}/dashboard?success=true&messageId=${messageId}`,
    cancel_url: `${request.headers.get("origin")}/dashboard`,
    metadata: { messageId },
  });

  return new Response(JSON.stringify({ id: session.id }), { status: 200 });
}