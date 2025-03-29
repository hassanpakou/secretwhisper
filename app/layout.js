import Footer from "./components/Footer";
import "./globals.css";

export const metadata = {
  title: "SecretWhisper",
  description: "Envoie et reçois des messages anonymes",
  openGraph: {
    title: "SecretWhisper - Messages Anonymes",
    description: "Partage ton lien et reçois des messages anonymes de tes amis sur SecretWhisper !",
    url: "https://secret-whisper.vercel.app",
    siteName: "SecretWhisper",
    images: [
      {
        url: "https://secret-whisper.vercel.app/logo.png",
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
    title: "SecretWhisper - Messages Anonymes",
    description: "Partage ton lien et reçois des messages anonymes de tes amis sur SecretWhisper !",
    images: ["https://secret-whisper.vercel.app/logo.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        {/* Favicon principal */}
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        {/* Favicon pour différentes tailles */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        {/* Apple Touch Icon */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* Manifeste pour les appareils mobiles */}
        <link rel="manifest" href="/manifest.json" />
        {/* Métadonnées supplémentaires pour les appareils Windows */}
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
      </head>
      <body className="flex flex-col min-h-screen">
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}