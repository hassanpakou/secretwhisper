import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialise Stripe avec ta clé secrète
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function POST(request) {
  try {
    const { messageId } = await request.json(); // Récupère l'ID du message depuis le frontend

    // Crée une session de paiement
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Déverrouiller un message anonyme",
            },
            unit_amount: 100, // 1€ (en centimes)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?success=true&messageId=${messageId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/dashboard`,
    });

    return NextResponse.json({ id: session.id });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}