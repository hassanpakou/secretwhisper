import Footer from "./components/Footer";
import "./globals.css";

export const metadata = {
  title: "SecretWhisper",
  description: "Envoie et reçois des messages anonymes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="flex flex-col min-h-screen">
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}