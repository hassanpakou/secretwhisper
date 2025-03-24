export default function About() {
    return (
        <div className="flex flex-col items-center justify-center p-4 sm:p-8" style={{ background: "linear-gradient(to bottom, #1e3a8a, #f9a8d4)" }}>
        {/* Conteneur principal */}
        <div className="w-full max-w-2xl mx-auto text-center">
          {/* Icône de message */}
          <div className="relative mb-8">
            <svg
              className="w-16 h-16 text-white mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span className="absolute top-0 right-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
              1
            </span>
          </div>
  
          {/* Titre */}
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">
            À propos de SecretWhisper
          </h1>
  
          {/* Description */}
          <p className="text-lg sm:text-xl text-white mb-8 leading-relaxed">
            SecretWhisper est une plateforme qui te permet d’envoyer et de recevoir des messages anonymes en toute simplicité. Que tu veuilles partager un secret, poser une question ou simplement t’amuser, nous sommes là pour toi !
          </p>
  
          {/* Avantages */}
          <div className="bg-white bg-opacity-20 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Pourquoi utiliser SecretWhisper ?
            </h2>
            <ul className="text-white text-lg space-y-3">
              <li>📩 Envoie des messages anonymes à tes amis.</li>
              <li>🔒 Protège ton identité en toute sécurité.</li>
              <li>💸 Crée un compte pour découvrir qui t’a écrit (seulement 1$ !).</li>
            </ul>
          </div>
  
          {/* Appel à l’action */}
          <div className="mt-8">
            <a
              href="/signup"
              className="inline-block py-3 px-6 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-200 transform hover:scale-105 shadow-md"
            >
              Crée un compte maintenant !
            </a>
          </div>
  
          {/* Branding */}
          <div className="mt-12">
            <p className="text-3xl font-bold text-white">SecretWhisper</p>
            <p className="text-sm text-white">Messages anonymes, émotions sincères</p>
          </div>
        </div>
      </div>
    );
  }