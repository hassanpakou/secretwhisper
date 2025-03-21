import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SecretWhisper",
  description: "Envoie et reçois des messages anonymes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <main className="min-h-screen flex flex-col">{children}</main>
        <footer className="bg-gray-800 text-white p-4 mt-auto">
          <div className="max-w-7xl mx-auto text-center">
            <p>© 2025 SecretWhisper. Tous droits réservés.</p>
            <p className="text-sm mt-2">
              Créé par{" "}
              <a href="https://github.com/hassanpakou" className="underline hover:text-blue-400">
                Dalmon Pakou nestor Nestor Fabrice | Etudiant UPC
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}