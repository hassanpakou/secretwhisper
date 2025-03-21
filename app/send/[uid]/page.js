"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../../../lib/firebase";

export default function SendMessage() {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { uid } = useParams();

  const handleSend = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      setError("Vous devez être connecté pour envoyer un message.");
      return;
    }

    try {
      const messageId = `${auth.currentUser.uid}_${uid}_${Date.now()}`;
      await setDoc(doc(db, "messages", messageId), {
        senderId: auth.currentUser.uid,
        content,
        recipientId: uid,
        revealed: false,
      });
      router.push("/dashboard");
    } catch (err) {
      console.error("Erreur d'envoi :", err);
      setError("Erreur lors de l'envoi du message.");
    }
  };

  return (
    <div className="p-4 flex-grow">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
        Envoyer un message anonyme
      </h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form
        onSubmit={handleSend}
        className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 space-y-6"
      >
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Message
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            placeholder="Votre message..."
            rows="4"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200 text-sm sm:text-base"
        >
          Envoyer
        </button>
      </form>
    </div>
  );
}
const handleSend = async (e) => {
  e.preventDefault();
  if (!auth.currentUser) {
    setError("Vous devez être connecté pour envoyer un message.");
    console.log("Utilisateur non connecté");
    return;
  }

  try {
    const messageId = `${auth.currentUser.uid}_${uid}_${Date.now()}`;
    console.log("Envoi du message :", {
      messageId,
      senderId: auth.currentUser.uid,
      recipientId: uid,
      content,
    });
    await setDoc(doc(db, "messages", messageId), {
      senderId: auth.currentUser.uid,
      content,
      recipientId: uid,
      revealed: false,
    });
    console.log("Message envoyé avec succès");
    router.push("/dashboard");
  } catch (err) {
    console.error("Erreur d'envoi :", err);
    setError("Erreur lors de l'envoi du message.");
  }
};