"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [messageCount, setMessageCount] = useState(0);

  // Simuler un compteur qui augmente progressivement
  useEffect(() => {
    const targetCount = 12345; // Nombre cible pour l'exemple
    const duration = 2000; // Durée de l'animation en millisecondes
    const increment = targetCount / (duration / 50); // Incrément par intervalle

    const counter = setInterval(() => {
      setMessageCount((prev) => {
        const nextCount = prev + increment;
        if (nextCount >= targetCount) {
          clearInterval(counter);
          return targetCount;
        }
        return nextCount;
      });
    }, 50);

    return () => clearInterval(counter);
  }, []);

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
        Bienvenue sur SecretWhisper
      </h1>

      {/* Sous-titre */}
      <p className="text-lg sm:text-xl text-gray-200 mb-6 fade-in">
        Envoie et reçois des messages anonymes !
      </p>

      {/* Compteur */}
      <div className="card rounded-lg p-4 mb-8 fade-in">
        <p className="text-white text-lg font-semibold">
          <span className="text-2xl font-bold">{Math.floor(messageCount).toLocaleString()}</span>{" "}
          messages envoyés sur SecretWhisper !
        </p>
      </div>

      {/* Boutons */}
      <div className="flex gap-4 fade-in">
        <Link
          href="/signup"
          className="py-3 px-6 bg-indigo-600 text-white font-semibold rounded-lg button-style"
        >
          Créer un compte
        </Link>
        <Link
          href="/login"
          className="py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg button-style"
        >
          Se connecter
        </Link>
      </div>
    </div>
  );
}