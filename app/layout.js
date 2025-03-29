import Footer from "./components/Footer";
import "./globals.css";

export const metadata = {
  title: "SecretWhisper",
  description: "Envoie et reçois des messages anonymes",
  openGraph: {
    title: "SecretWhisper",
    description: "Envoie et reçois des messages anonymes avec SecretWhisper !",
    url: "https://secret-whisper.vercel.app", // Remplace par ton URL de production
    siteName: "SecretWhisper",
    images: [
      {
        url: "https://secret-whisper.vercel.app/logo.png", // Remplace par l'URL absolue de ton logo
        width: 1200,
        height: 630,
        alt: "Logo de SecretWhisper",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SecretWhisper",
    description: "Envoie et reçois des messages anonymes avec SecretWhisper !",
    images: ["https://secret-whisper.vercel.app/logo.png"], // Remplace par l'URL absolue de ton logo
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        {/* Favicon (optionnel) */}
        <link rel="icon" href="/favicon.png" />
      </head>
      <body className="flex flex-col min-h-screen">
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}