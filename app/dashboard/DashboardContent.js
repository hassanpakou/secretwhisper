"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth, db } from "../../lib/firebase";
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { loadStripe } from "@stripe/stripe-js";
import { signOut } from "firebase/auth";
import { WhatsappShareButton, WhatsappIcon } from "react-share";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function DashboardContent() {
  const [messages, setMessages] = useState([]);
  const [userLink, setUserLink] = useState("");
  const [shareLink, setShareLink] = useState("");
  const [loadingPayment, setLoadingPayment] = useState({});
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
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-lg">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Boutons de navigation */}
        <div className="flex justify-end mb-4 gap-3">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
            >
              Déconnexion
            </button>
          ) : (
            <>
              <button
                onClick={handleLogin}
                className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
              >
                Se connecter
              </button>
              <button
                onClick={handleSignup}
                className="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-200"
              >
                Créer un compte
              </button>
            </>
          )}
        </div>

        {/* Modale pour les utilisateurs non connectés */}
        {showLoginPrompt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Connectez-vous pour voir l’expéditeur !
              </h2>
              <p className="text-gray-600 mb-6">
                Vous devez être connecté pour voir qui vous a écrit. Connectez-vous ou créez un compte !
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleLogin}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Se connecter
                </button>
                <button
                  onClick={handleSignup}
                  className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
                >
                  Créer un compte
                </button>
              </div>
            </div>
          </div>
        )}

        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          Tes messages anonymes
        </h1>
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <p className="text-gray-700 mb-2">Partage ce lien pour recevoir des messages :</p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              value={userLink || ""}
              readOnly
              className="w-full sm:flex-1 p-3 border border-gray-300 rounded-md bg-gray-50"
            />
            <div className="flex gap-2 w-full sm:w-auto justify-center">
              {shareLink && (
                <WhatsappShareButton
                  url={shareLink}
                  title="Envoie-moi un message anonyme sur SecretWhisper !"
                  className="flex items-center justify-center"
                >
                  <WhatsappIcon size={40} round className="hover:scale-105 transition-transform" />
                </WhatsappShareButton>
              )}
            </div>
          </div>
        </div>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="grid gap-6">
          {messages && messages.length > 0 ? (
            messages.map((msg) => (
              <div key={msg.id} className="bg-white rounded-xl shadow-md p-6 relative">
                <p className="text-gray-800 mb-4 pr-20">{msg.content || "Contenu indisponible"}</p>
                <p className="text-gray-600 mb-2">
                  Expéditeur : {msg.revealed ? msg.senderId : "Anonyme"}
                </p>
                <p className="text-gray-500 text-sm mb-4">
                  Reçu le : {formatDateTime(msg.timestamp)}
                </p>
                {!msg.revealed && (
                  <button
                    onClick={() => handlePayment(msg.id)}
                    disabled={loadingPayment[msg.id]}
                    className={`w-full py-3 text-white font-semibold rounded-md transition duration-200 ${
                      loadingPayment[msg.id]
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {loadingPayment[msg.id] ? "Chargement..." : "Payer 1$"}
                  </button>
                )}
                <a
                  href={getMessageShareLink(msg.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-2 right-2 py-1 px-2 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 transition duration-200"
                >
                  WhatsApp
                </a>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center">Aucun message pour l’instant.</p>
          )}
        </div>
      </div>
    </div>
  );
}