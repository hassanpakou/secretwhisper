"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ShareClient({ uid }) {
  useEffect(() => {
    if (!uid) {
      // Redirige vers la page d'accueil si aucun UID n'est fourni
      window.location.href = "/";
    }
  }, [uid]);

  const shareLink = `/send/${uid}`;

  return (
    <div className="gradient-bg flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Icône de message */}
      <div className="relative mb-8 fade-in">
        <svg
          className="w-16 h-16 text-white mx-auto"
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
        <span className="absolute top-0 right-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
          1
        </span>
      </div>

      {/* Titre */}
      <h1 className="text-4xl sm:text-5xl font-extrabold text-white text-center mb-4 fade-in">
        SecretWhisper
      </h1>

      {/* Sous-titre */}
      <p className="text-lg sm:text-xl text-gray-200 mb-6 fade-in">
        Envoie un message anonyme à ton ami !
      </p>

      {/* Lien de partage */}
      <div className="card rounded-lg p-4 mb-8 fade-in w-full max-w-md">
        <p className="text-white text-lg font-semibold mb-2">Clique pour envoyer un message :</p>
        <Link
          href={shareLink}
          className="block w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg text-center button-style"
        >
          Envoyer un message anonyme
        </Link>
      </div>
    </div>
  );
}