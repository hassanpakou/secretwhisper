"use client";

import { useState } from "react";
import { db } from "../../../lib/firebase"; // Ajuste le chemin selon ton dossier
import { collection, addDoc } from "firebase/firestore";
import { useParams } from "next/navigation";

export default function SendMessage() {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { uid } = useParams(); // Récupère l'UID depuis l'URL

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      alert("Veuillez entrer un message !");
      return;
    }

    setIsSubmitting(true);

    try {
      // Ajoute le message à Firestore
      await addDoc(collection(db, "messages"), {
        content: message,
        recipient: uid,
        paid: false, // Par défaut, le message est verrouillé
        createdAt: new Date().toISOString(),
      });
      setSuccess(true);
      setMessage(""); // Réinitialise le champ
    } catch (error) {
      alert("Erreur lors de l'envoi : " + error.message);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Envoyer un message anonyme</h1>
        {success ? (
          <p className="text-green-500 mb-4">Message envoyé avec succès !</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Écris ton message ici..."
              className="w-full p-2 border rounded mb-4"
              rows="4"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full p-2 text-white rounded ${
                isSubmitting ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isSubmitting ? "Envoi en cours..." : "Envoyer"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}