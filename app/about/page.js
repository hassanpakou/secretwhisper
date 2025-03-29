export default function About() {
    return (
      <div className="gradient-bg flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-2xl mx-auto text-center">
          <div className="relative mb-8 fade-in">
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
  
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 fade-in">
            À propos de SecretWhisper
          </h1>
  
          <p className="text-lg sm:text-xl text-gray-200 mb-8 leading-relaxed fade-in">
            SecretWhisper est une plateforme qui te permet d’envoyer et de recevoir des messages anonymes en toute simplicité. Que tu veuilles partager un secret, poser une question ou simplement t’amuser, nous sommes là pour toi !
          </p>
  
          <div className="card rounded-lg p-6 mb-8 fade-in">
            <h2 className="text-2xl font-bold text-white mb-4">
              Pourquoi utiliser SecretWhisper ?
            </h2>
            <ul className="text-gray-200 text-lg space-y-3">
              <li>📩 Envoie des messages anonymes à tes amis.</li>
              <li>🔒 Protège ton identité en toute sécurité.</li>
              <li>💸 Crée un compte pour découvrir qui t’a écrit (seulement 1$ !).</li>
            </ul>
          </div>
  
          <div className="mt-8 fade-in">
            <a
              href="/signup"
              className="inline-block py-3 px-6 bg-indigo-600 text-white font-semibold rounded-lg button-style"
            >
              Crée un compte maintenant !
            </a>
          </div>
  
          <div className="mt-12 fade-in">
            <p className="text-3xl font-bold text-white">SecretWhisper</p>
            <p className="text-sm text-gray-200">Messages anonymes, émotions sincères</p>
            <p className="text-sm text-gray-200">Version 0.4</p>
          </div>
        </div>
      </div>
    );
  }