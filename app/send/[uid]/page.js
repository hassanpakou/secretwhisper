"use client";

export const dynamic = "force-dynamic"; // Ajoute cette ligne

import { useState } from "react";
import { db } from "../../../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useParams } from "next/navigation";

export default function SendMessage() {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { uid } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      alert("Veuillez entrer un message !");
      return;
    }
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "messages"), {
        content: message,
        recipient: uid,
        paid: false,
        createdAt: new Date().toISOString(),
      });
      setSuccess(true);
      setMessage("");
    } catch (error) {
      alert("Erreur lors de l'envoi : " + error.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
          Envoyer un message anonyme
        </h1>
        {success ? (
          <div className="text-center">
            <p className="text-green-600 text-lg mb-4">Message envoyé avec succès !</p>
            <button
              onClick={() => setSuccess(false)}
              className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
            >
              Envoyer un autre
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Ton message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Écris ton message ici..."
                rows="4"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 text-white font-semibold rounded-md transition duration-200 ${
                isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
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