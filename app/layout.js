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
        <main>{children}</main>
      </body>
    </html>
  );
}