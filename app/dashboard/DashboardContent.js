"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth, db } from "../../lib/firebase";
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { loadStripe } from "@stripe/stripe-js";
import { signOut } from "firebase/auth";
import { WhatsappShareButton, WhatsappIcon } from "react-share";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function DashboardContent() {
  const [messages, setMessages] = useState([]);
  const [userLink, setUserLink] = useState("");
  const [shareLink, setShareLink] = useState("");
  const [loadingPayment, setLoadingPayment] = useState({});
  const [loadingDelete, setLoadingDelete] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
        if (typeof window !== "undefined" && window.location) {
          const origin = window.location.origin;
          setUserLink(`${origin}/send/${user.uid}`);
          setShareLink(`${origin}/share?uid=${user.uid}`);
        }
      } else {
        setIsAuthenticated(false);
        if (uid && typeof window !== "undefined" && window.location) {
          const origin = window.location.origin;
          setUserLink(`${origin}/send/${uid}`);
          setShareLink(`${origin}/share?uid=${uid}`);
        }
      }

      const recipientId = user ? user.uid : uid;
      if (!recipientId) {
        setError("Aucun utilisateur spécifié.");
        setIsLoading(false);
        return;
      }

      const q = query(collection(db, "messages"), where("recipientId", "==", recipientId));
      const unsubscribeMessages = onSnapshot(q, (snapshot) => {
        const userMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(userMessages);
        setIsLoading(false);
      }, (err) => {
        console.error("Erreur de récupération en temps réel :", err);
        setError("Erreur lors de la récupération des messages : " + err.message);
        setIsLoading(false);
      });

      return () => unsubscribeMessages();
    });
    return () => unsubscribeAuth();
  }, [uid]);

  const handlePayment = async (messageId) => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    setLoadingPayment((prev) => ({ ...prev, [messageId]: true }));
    try {
      const response = await fetch("/api/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 100, messageId }),
      });
      const { id } = await response.json();
      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: id });
    } catch (error) {
      console.error("Erreur de paiement :", error);
      alert("Erreur lors du paiement : " + error.message);
    }
    setLoadingPayment((prev) => ({ ...prev, [messageId]: false }));
  };

  const unlockMessage = async (messageId) => {
    const messageRef = doc(db, "messages", messageId);
    await updateDoc(messageRef, { revealed: true });
  };

  const handleDelete = async (messageId) => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    setLoadingDelete((prev) => ({ ...prev, [messageId]: true }));
    try {
      const messageRef = doc(db, "messages", messageId);
      await deleteDoc(messageRef);
      console.log("Message supprimé avec succès :", messageId);
    } catch (error) {
      console.error("Erreur lors de la suppression du message :", error);
      setError("Erreur lors de la suppression du message : " + error.message);
    }
    setLoadingDelete((prev) => ({ ...prev, [messageId]: false }));
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
      setError("Erreur lors de la déconnexion : " + error.message);
    }
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const handleSignup = () => {
    router.push("/signup");
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

  const getMessageShareLink = (messageId) => {
    if (typeof window === "undefined" || !window.location) return "";
    return `${window.location.origin}/message/${messageId}`;
  };

  const formatDateTime = (timestamp) => {
    if (!timestamp) return "Date inconnue";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="gradient-bg flex items-center justify-center">
        <p className="text-white text-lg">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="gradient-bg p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Boutons de navigation */}
        <div className="flex justify-end mb-4 gap-3 fade-in">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="py-2 px-4 bg-red-600 text-white rounded-md button-style"
            >
              Déconnexion
            </button>
          ) : (
            <>
              <button
                onClick={handleLogin}
                className="py-2 px-4 bg-blue-600 text-white rounded-md button-style"
              >
                Se connecter
              </button>
              <button
                onClick={handleSignup}
                className="py-2 px-4 bg-indigo-600 text-white rounded-md button-style"
              >
                Créer un compte
              </button>
            </>
          )}
        </div>

        {/* Modale pour les utilisateurs non connectés */}
        {showLoginPrompt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 fade-in">
            <div className="card rounded-lg p-6 max-w-sm w-full shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4">
                Connectez-vous pour voir l’expéditeur !
              </h2>
              <p className="text-gray-200 mb-6">
                Vous devez être connecté pour voir qui vous a écrit. Connectez-vous ou créez un compte !
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleLogin}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg button-style"
                >
                  Se connecter
                </button>
                <button
                  onClick={handleSignup}
                  className="flex-1 py-2 bg-indigo-600 text-white rounded-lg button-style"
                >
                  Créer un compte
                </button>
              </div>
            </div>
          </div>
        )}

        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-6 fade-in">
          Tes messages anonymes
        </h1>
        <div className="card rounded-xl p-6 mb-6 fade-in">
          <p className="text-gray-200 mb-2">Partage ce lien pour recevoir des messages :</p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              value={userLink || ""}
              readOnly
              className="w-full sm:flex-1 p-3 input-style rounded-md"
            />
            <div className="flex gap-2 w-full sm:w-auto justify-center">
              {shareLink && (
                <WhatsappShareButton
                  url={shareLink}
                  title="Envoie-moi un message anonyme sur SecretWhisper !"
                  className="flex items-center justify-center"
                >
                  <WhatsappIcon size={40} round className="button-style" />
                </WhatsappShareButton>
              )}
            </div>
          </div>
        </div>
        {error && (
          <p className="text-red-400 text-center mb-4 bg-red-500 bg-opacity-20 p-3 rounded-lg fade-in">
            {error}
          </p>
        )}
        <div className="grid gap-6">
          {messages && messages.length > 0 ? (
            messages.map((msg, index) => (
              <div
                key={msg.id}
                className="card rounded-xl p-6 relative fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Bouton Supprimer superposé */}
                <button
                  onClick={() => handleDelete(msg.id)}
                  disabled={loadingDelete[msg.id]}
                  className={`absolute top-3 right-3 p-2 rounded-full text-white transition duration-200 ${
                    loadingDelete[msg.id]
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                  title="Supprimer le message"
                >
                  {loadingDelete[msg.id] ? (
                    <svg
                      className="w-5 h-5 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a1 1 0 011 1v1H9V4a1 1 0 011-1zm-5 4h12"
                      />
                    </svg>
                  )}
                </button>

                <p className="text-gray-200 mb-4 pr-10">{msg.content || "Contenu indisponible"}</p>
                <p className="text-gray-300 mb-2">
                  Expéditeur : {msg.revealed ? msg.senderId : "Anonyme"}
                </p>
                <p className="text-gray-400 text-sm mb-4">
                  Reçu le : {formatDateTime(msg.timestamp)}
                </p>
                {!msg.revealed && (
                  <button
                    onClick={() => handlePayment(msg.id)}
                    disabled={loadingPayment[msg.id]}
                    className={`w-full py-3 text-white font-semibold rounded-md button-style ${
                      loadingPayment[msg.id]
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600"
                    }`}
                  >
                    {loadingPayment[msg.id] ? "Chargement..." : "Payer 1$"}
                  </button>
                )}
                <a
                  href={getMessageShareLink(msg.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-2 right-2 py-1 px-2 bg-green-500 text-white text-sm rounded-md button-style"
                >
                  WhatsApp
                </a>
              </div>
            ))
          ) : (
            <p className="text-gray-200 text-center fade-in">Aucun message pour l’instant.</p>
          )}
        </div>
      </div>
    </div>
  );
}