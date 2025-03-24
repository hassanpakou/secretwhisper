"use client";

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
    <div className="gradient-bg flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md card rounded-2xl p-8 shadow-xl fade-in">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-white mb-8">
          Inscription
        </h1>
        {error && (
          <p className="text-red-400 text-center mb-6 bg-red-500 bg-opacity-20 p-3 rounded-lg">
            {error}
          </p>
        )}
        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 input-style rounded-lg"
              placeholder="votre@email.com"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 input-style rounded-lg"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg button-style"
          >
            S'inscrire
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-200">
          Déjà un compte ?{" "}
          <a href="/login" className="text-indigo-300 hover:underline">
            Connectez-vous
          </a>
        </p>
      </div>
    </div>
  );
}