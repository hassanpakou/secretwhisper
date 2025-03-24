"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { auth, db } from "../../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function SendMessage() {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const { uid } = useParams();

  useEffect(() => {
    if (!auth.currentUser) {
      setShowModal(true);
    }
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      setError("Le message ne peut pas être vide.");
      return;
    }

    try {
      console.log("Envoi du message :", {
        senderId: auth.currentUser ? auth.currentUser.uid : "anonyme",
        recipientId: uid,
        content,
      });
      await addDoc(collection(db, "messages"), {
        senderId: auth.currentUser ? auth.currentUser.uid : "anonyme",
        content,
        recipientId: uid,
        revealed: false,
        timestamp: serverTimestamp(),
      });
      console.log("Message envoyé avec succès");
      router.push(`/dashboard?uid=${uid}`);
    } catch (err) {
      console.error("Erreur d'envoi :", err);
      setError("Erreur lors de l'envoi du message : " + err.message);
    }
  };

  const handleCreateAccount = () => {
    router.push("/signup");
  };

  const handleContinueWithoutAccount = () => {
    setShowModal(false);
  };

  return (
    <div className="gradient-bg flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md mx-auto">
        <div className="flex justify-end mb-6 fade-in">
          <button
            onClick={handleCreateAccount}
            className="py-2 px-4 bg-indigo-600 text-white rounded-lg button-style"
          >
            Créer un compte
          </button>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 fade-in">
            <div className="card rounded-lg p-6 max-w-sm w-full shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4">
                Créez un compte pour plus de fonctionnalités !
              </h2>
              <p className="text-gray-200 mb-6">
                Si vous créez un compte, vous pourrez voir qui vous a écrit en payant 1$ !
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleCreateAccount}
                  className="flex-1 py-2 bg-indigo-600 text-white rounded-lg button-style"
                >
                  Créer un compte
                </button>
                <button
                  onClick={handleContinueWithoutAccount}
                  className="flex-1 py-2 bg-gray-300 text-gray-800 rounded-lg button-style"
                >
                  Continuer sans compte
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="card rounded-2xl p-8 shadow-xl fade-in">
          <div className="flex justify-center mb-6">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-white mb-8">
            Envoyer un message anonyme
          </h1>

          {error && (
            <p className="text-red-400 text-center mb-6 bg-red-500 bg-opacity-20 p-3 rounded-lg">
              {error}
            </p>
          )}

          <form onSubmit={handleSend} className="space-y-6">
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-200 mb-2"
              >
                Votre message
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-4 input-style rounded-lg"
                placeholder="Écrivez votre message ici..."
                rows="5"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg button-style"
            >
              Envoyer
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}