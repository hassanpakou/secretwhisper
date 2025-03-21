import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Bienvenue sur SecretWhisper</h1>
      <p className="mb-6">Envoie et reçois des messages anonymes !</p>
      <div>
        <Link href="/signup" className="bg-blue-500 text-white p-2 rounded mr-2">
          Créer un compte
        </Link>
        <Link href="/login" className="bg-gray-500 text-white p-2 rounded">
          Se connecter
        </Link>
      </div>
    </div>
  );
}