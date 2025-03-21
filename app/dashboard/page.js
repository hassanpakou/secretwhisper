"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { auth, db } from "../../lib/firebase";
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { loadStripe } from "@stripe/stripe-js";
import { WhatsappShareButton, WhatsappIcon } from "react-share";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function Dashboard() {
  const [messages, setMessages] = useState([]);
  const [userLink, setUserLink] = useState("");
  const [loadingPayment, setLoadingPayment] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      } else {
        if (typeof window !== "undefined") {
          setUserLink(`${window.location.origin}/send/${user.uid}`);
        }
        const q = query(collection(db, "messages"), where("recipient", "==", user.uid));
        const unsubscribeMessages = onSnapshot(q, (snapshot) => {
          const userMessages = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setMessages(userMessages);
          setIsLoading(false);
        });
        return () => unsubscribeMessages();
      }
    });
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-lg">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Tes messages anonymes</h1>
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <p className="text-gray-700 mb-2">Partage ce lien pour recevoir des messages :</p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              value={userLink}
              readOnly
              className="w-full sm:flex-1 p-3 border border-gray-300 rounded-md bg-gray-50"
            />
            {userLink && (
              <WhatsappShareButton
                url={userLink}
                title="Envoie-moi un message anonyme sur SecretWhisper !"
                className="flex items-center justify-center w-full sm:w-auto"
              >
                <WhatsappIcon size={40} round className="hover:scale-105 transition-transform" />
              </WhatsappShareButton>
            )}
          </div>
        </div>
        <div className="grid gap-6">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-white rounded-xl shadow-md p-6">
              <p className="text-gray-800 mb-4">
                {msg.paid ? msg.content : "Ce message est verrouillé. Paye pour le voir."}
              </p>
              {!msg.paid && (
                <button
                  onClick={() => handlePayment(msg.id)}
                  disabled={loadingPayment[msg.id]}
                  className={`w-full py-3 text-white font-semibold rounded-md transition duration-200 ${
                    loadingPayment[msg.id]
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {loadingPayment[msg.id] ? "Chargement..." : "Payer 1€"}
                </button>
              )}
            </div>
          ))}
          {messages.length === 0 && (
            <p className="text-gray-600 text-center">Aucun message pour l'instant.</p>
          )}
        </div>
      </div>
    </div>
  );
}