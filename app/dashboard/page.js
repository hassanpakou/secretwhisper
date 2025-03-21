"use client";

import { useState, useEffect } from "react";
import { auth, db } from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ShareSocial } from "react-share";
import { ShareIcon } from "react-share";

const stripePromise = loadStripe("ta-clé-publique-stripe"); // Remplace par ta clé Stripe publique

export default function Dashboard() {
  const [messages, setMessages] = useState([]);
  const [userLink, setUserLink] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      const querySnapshot = await getDocs(collection(db, "messages"));
      const userMessages = querySnapshot.docs
        .filter((doc) => doc.data().recipient === auth.currentUser?.uid)
        .map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(userMessages);
    };

    if (auth.currentUser) {
      fetchMessages();
      setUserLink(`${window.location.origin}/send/${auth.currentUser.uid}`);
    }
  }, []);

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Tes messages anonymes</h1>
      <p>Partage ce lien pour recevoir des messages :</p>
      <input value={userLink} readOnly className="border p-2 mb-4 w-full" />
      <div className="mb-6">
        <ShareSocial
          url={userLink}
          socialTypes={["whatsapp", "instagram"]}
        >
          <ShareIcon size={32} round />
        </ShareSocial>
      </div>
      <div>
        {messages.map((msg) => (
          <div key={msg.id} className="bg-gray-100 p-4 rounded mb-4">
            <p>{msg.paid ? msg.content : "Paye pour voir ce message"}</p>
            {!msg.paid && (
              <Elements stripe={stripePromise}>
                <button className="bg-green-500 text-white p-2 rounded mt-2">
                  Payer 1€ (intégration Stripe à compléter)
                </button>
              </Elements>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}