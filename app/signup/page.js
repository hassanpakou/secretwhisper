"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    console.log("Tentative d'inscription avec :", { email, password });
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Inscription réussie :", userCredential.user);
      router.push("/dashboard");
    } catch (err) {
      console.error("Erreur d'inscription :", err.code, err.message);
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("Cet email est déjà utilisé.");
          break;
        case "auth/invalid-email":
          setError("L'email est invalide.");
          break;
        case "auth/weak-password":
          setError("Le mot de passe est trop faible (minimum 6 caractères).");
          break;
        default:
          setError("Une erreur est survenue lors de l'inscription.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">Inscription</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="votre@email.com"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200"
          >
            S'inscrire
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Déjà un compte ?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Connectez-vous
          </a>
        </p>
      </div>
    </div>
  );
}