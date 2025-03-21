"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function SuccessClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        router.push("/dashboard");
        return;
      }

      try {
        const res = await fetch("/api/verify-stripe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        const { messageId } = await res.json();

        if (messageId) {
          await updateDoc(doc(db, "messages", messageId), { revealed: true });
        }
        router.push("/dashboard");
      } catch (err) {
        console.error("Erreur de vérification :", err);
        router.push("/dashboard");
      }
    };

    verifyPayment();
  }, [sessionId, router]);

  return (
    <div className="flex items-center justify-center p-4">
      <p className="text-xl font-bold text-green-600">Paiement réussi ! Redirection...</p>
    </div>
  );
}