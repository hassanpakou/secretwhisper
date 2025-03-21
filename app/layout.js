import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SecretWhisper",
  description: "Envoie et reçois des messages anonymes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {/* Header */}
        <header className="bg-blue-600 text-white p-4 shadow-md">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">
              SecretWhisper
            </Link>
            <nav className="space-x-4">
              <Link href="/login" className="hover:underline">
                Connexion
              </Link>
              <Link href="/signup" className="hover:underline">
                Inscription
              </Link>
              <Link href="/dashboard" className="hover:underline">
                Dashboard
              </Link>
            </nav>
          </div>
        </header>

        {/* Contenu principal */}
        <main className="min-h-screen">{children}</main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white p-4 mt-8">
          <div className="max-w-7xl mx-auto text-center">
            <p>&copy; 2025 SecretWhisper. Tous droits réservés.</p>
            <p className="text-sm mt-2">
              Créé par{" "}
              <a href="https://github.com/hassanpakou" className="underline hover:text-blue-400">
                Dalmo Pakou nestor Fabrice | Etudiant UPC
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}