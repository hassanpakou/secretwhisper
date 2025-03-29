import { Suspense } from "react";
import MessageContent from "./MessageContent";

export async function generateMetadata({ params }) {
  const { messageId } = params;

  // Tu peux récupérer le contenu du message depuis Firestore si tu veux l'inclure dans l'aperçu
  // Pour l'exemple, on utilise des valeurs statiques
  return {
    title: "Message Anonyme - SecretWhisper",
    description: "Découvre un message anonyme sur SecretWhisper !",
    openGraph: {
      title: "Message Anonyme - SecretWhisper",
      description: "Découvre un message anonyme sur SecretWhisper !",
      url: `https://secret-whisper.vercel.app/message/${messageId}`,
      images: [
        {
          url: "https://secret-whisper.vercel.app/logo.png", // Remplace par l'URL de ton logo
          width: 1200,
          height: 630,
          alt: "Logo de SecretWhisper",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Message Anonyme - SecretWhisper",
      description: "Découvre un message anonyme sur SecretWhisper !",
      images: ["https://secret-whisper.vercel.app/logo.png"],
    },
  };
}

export default function Message() {
  return (
    <Suspense
      fallback={
        <div className="bg-white flex flex-col items-center justify-center p-4">
          <div
            className="w-full text-center py-12 rounded-b-3xl"
            style={{
              background: "linear-gradient(to right, #ff5e62, #f7b733)",
            }}
          >
            <p className="text-white text-lg">Chargement...</p>
          </div>
        </div>
      }
    >
      <MessageContent />
    </Suspense>
  );
}