"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { db } from "../../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function MessageContent() {
  const { messageId } = useParams();
  const [messageContent, setMessageContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMessage = async () => {
      if (!messageId) return;
      try {
        const messageRef = doc(db, "messages", messageId);
        const messageSnap = await getDoc(messageRef);
        if (messageSnap.exists()) {
          setMessageContent(messageSnap.data().content || "Contenu indisponible");
        } else {
          setError("Message non trouvé.");
        }
      } catch (err) {
        console.error("Erreur lors de la récupération du message :", err);
        setError("Erreur lors de la récupération du message : " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMessage();
  }, [messageId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-lg">Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{
        background: "linear-gradient(to right, #ff5e62, #f7b733)",
      }}
    >
      <h1 className="text-4xl sm:text-5xl font-bold text-white text-center mb-4">
        envoie-moi des messages anonymes !
      </h1>
      <div className="bg-white rounded-lg p-6 w-full max-w-md text-center shadow-lg">
        <p className="text-gray-800 text-lg">{messageContent}</p>
      </div>
    </div>
  );
}