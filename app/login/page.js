"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Tentative de connexion avec :", { email, password });
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Connexion réussie :", userCredential.user);
      router.push("/dashboard");
    } catch (err) {
      console.error("Erreur de connexion :", err.code, err.message);
      switch (err.code) {
        case "auth/invalid-email":
          setError("L'email est invalide.");
          break;
        case "auth/user-not-found":
          setError("Aucun utilisateur trouvé avec cet email.");
          break;
        case "auth/wrong-password":
          setError("Mot de passe incorrect.");
          break;
        case "auth/too-many-requests":
          setError("Trop de tentatives. Réessayez plus tard.");
          break;
        default:
          setError("Une erreur est survenue. Vérifiez vos identifiants.");
      }
    }
  };

  return (
    <div className="gradient-bg flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md card rounded-2xl p-8 shadow-xl fade-in">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-white mb-8">
          Connexion
        </h1>
        {error && (
          <p className="text-red-400 text-center mb-6 bg-red-500 bg-opacity-20 p-3 rounded-lg">
            {error}
          </p>
        )}
        <form onSubmit={handleLogin} className="space-y-6">
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
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg button-style"
          >
            Se connecter
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-200">
          Pas de compte ?{" "}
          <a href="/signup" className="text-indigo-300 hover:underline">
            Inscrivez-vous
          </a>
        </p>
      </div>
    </div>
  );
}