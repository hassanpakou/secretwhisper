import ShareClient from "./ShareClient";

// Fonction pour générer les métadonnées (côté serveur)
export async function generateMetadata({ searchParams }) {
  const uid = searchParams.uid;

  return {
    title: "Partage ton lien SecretWhisper",
    description: "Envoie un message anonyme à un ami sur SecretWhisper !",
    openGraph: {
      title: "Partage ton lien SecretWhisper",
      description: "Envoie un message anonyme à un ami sur SecretWhisper !",
      url: `https://secret-whisper.vercel.app/share?uid=${uid}`,
      images: [
        {
          url: "https://secret-whisper.vercel.app/logo.png",
          width: 1200,
          height: 630,
          alt: "Logo de SecretWhisper",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Partage ton lien SecretWhisper",
      description: "Envoie un message anonyme à un ami sur SecretWhisper !",
      images: ["https://secret-whisper.vercel.app/logo.png"],
    },
  };
}

export default function Share({ searchParams }) {
  const uid = searchParams.uid;

  if (!uid) {
    return (
      <div className="gradient-bg flex flex-col items-center justify-center p-4 sm:p-8">
        <p className="text-white text-lg">Aucun utilisateur spécifié. Redirection...</p>
      </div>
    );
  }

  return <ShareClient uid={uid} />;
}