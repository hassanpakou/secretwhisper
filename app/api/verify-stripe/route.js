import Stripe from "stripe";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
  });

  const { sessionId } = await request.json();
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status === "paid") {
    return new Response(JSON.stringify({ messageId: session.metadata.messageId }), {
      status: 200,
    });
  }
  return new Response(JSON.stringify({ error: "Paiement non confirmé" }), { status: 400 });
}