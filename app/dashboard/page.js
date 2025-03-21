"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { auth, db } from "../../lib/firebase";
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { loadStripe } from "@stripe/stripe-js";
import { WhatsappShareButton, WhatsappIcon } from "react-share";

// Initialise Stripe en dehors du composant
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function Dashboard() {
  const [messages, setMessages] = useState([]);
  const [userLink, setUserLink] = useState(""); // Valeur par défaut vide
  const [loadingPayment, setLoadingPayment] = useState({});
  const [isLoading, setIsLoading] = useState(true); // État pour gérer le chargement initial

  useEffect(() => {
    // Vérifie l'état de l'authentification
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        // Redirige vers la page de connexion si non connecté
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      } else {
        // Si connecté, mets à jour userLink
        if (typeof window !== "undefined") {
          setUserLink(`${window.location.origin}/send/${user.uid}`);
        }

        // Charge les messages
        const q = query(collection(db, "messages"), where("recipient", "==", user.uid));
        const unsubscribeMessages = onSnapshot(q, (snapshot) => {
          const userMessages = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setMessages(userMessages);
          setIsLoading(false); // Fin du chargement
        });

        // Nettoie l'abonnement aux messages
        return () => unsubscribeMessages();
      }
    });

    // Nettoie l'abonnement à l'authentification
    return () => unsubscribeAuth();
  }, []);

  const handlePayment = async (messageId) => {
    setLoadingPayment((prev) => ({ ...prev, [messageId]: true }));

    try {
      const response = await fetch("/api/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId }),
      });
      const { id } = await response.json();

      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: id });
    } catch (error) {
      alert("Erreur lors du paiement : " + error.message);
    }

    setLoadingPayment((prev) => ({ ...prev, [messageId]: false }));
  };

  const unlockMessage = async (messageId) => {
    const messageRef = doc(db, "messages", messageId);
    await updateDoc(messageRef, { paid: true });
  };

  useEffect(() => {
    if (typeof window === "undefined" || !window.location) return;
    const search = window.location.search || "";
    const urlParams = new URLSearchParams(search);
    const success = urlParams.get("success");
    const messageId = urlParams.get("messageId");

    if (success === "true" && messageId) {
      unlockMessage(messageId);
    }
  }, []);

  // Affiche un message de chargement pendant l'initialisation
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Tes messages anonymes</h1>
      <p>Partage ce lien pour recevoir des messages :</p>
      <input value={userLink} readOnly className="border p-2 mb-4 w-full" />
      <div className="mb-6">
        {userLink && (
          <WhatsappShareButton url={userLink} title="Envoie-moi un message anonyme sur SecretWhisper !">
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
        )}
      </div>
      <div>
        {messages.map((msg) => (
          <div key={msg.id} className="bg-gray-100 p-4 rounded mb-4">
            <p>{msg.paid ? msg.content : "Paye pour voir ce message"}</p>
            {!msg.paid && (
              <button
                onClick={() => handlePayment(msg.id)}
                disabled={loadingPayment[msg.id]}
                className={`bg-green-500 text-white p-2 rounded mt-2 ${
                  loadingPayment[msg.id] ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loadingPayment[msg.id] ? "Chargement..." : "Payer 1€"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}