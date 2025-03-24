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
      <div className="bg-white flex flex-col items-center justify-center p-4">
        <div
          className="w-full text-center py-12 rounded-b-3xl"
          style={{
            background: "linear-gradient(to right, #ff5e62, #f7b733)",
          }}
        >
          <p className="text-white text-lg">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white flex flex-col items-center justify-center p-4">
        <div
          className="w-full text-center py-12 rounded-b-3xl"
          style={{
            background: "linear-gradient(to right, #ff5e62, #f7b733)",
          }}
        >
          <p className="text-red-400 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white flex flex-col items-center p-4 sm:p-8">
      {/* Header dégradé */}
      <div
        className="w-full text-center py-12 rounded-b-3xl"
        style={{
          background: "linear-gradient(to right, #FF0004FF, #1E00FFFF)",
        }}
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
          envoie-moi des messages anonymes !
        </h1>
      </div>

      {/* Contenu blanc */}
      <div className="bg-white rounded-3xl p-6 w-full max-w-md text-center shadow-lg -mt-6">
        <p className="text-gray-800 text-xl font-bold leading-relaxed">
          {messageContent}
        </p>
      </div>
    </div>
  );
}