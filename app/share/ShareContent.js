"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function ShareContent() {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");
  const [userLink, setUserLink] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && window.location) {
      setUserLink(`${window.location.origin}/send/${uid}`);
    }
  }, [uid]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{
        background: "linear-gradient(to bottom, #1e3a8a, #f9a8d4)",
      }}
    >
      <div className="relative mb-6">
        <svg
          className="w-16 h-16 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M21 2H3a2 2 0 00-2 2v16a2 2 0 002 2h18a2 2 0 002-2V4a2 2 0 00-2-2zm-1 16H4V6h16v12zM8 8h8v2H8V8zm0 4h8v2H8v-2zm0 4h8v2H8v-2z" />
        </svg>
        <span className="absolute top-0 right-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
          1
        </span>
      </div>
      <h1 className="text-4xl sm:text-5xl font-bold text-white text-center mb-8">
        envoie-moi des messages anonymes !
      </h1>
      <div className="bg-white bg-opacity-20 rounded-lg p-4 w-full max-w-md text-center">
        <p className="text-white text-lg mb-2">Collez le lien ici!</p>
        <a
          href={userLink || "#"}
          className="text-blue-300 text-sm break-all hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {userLink || "Chargement..."}
        </a>
      </div>
      <div className="mt-8 text-center">
        <p className="text-sm text-white">Version 0.1</p>
      </div>
    </div>
  );
}