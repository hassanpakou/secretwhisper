import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black bg-opacity-80 text-white py-2 sm:py-3 w-full">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center px-4 text-sm sm:text-base">
        <p className="text-xs sm:text-sm text-center sm:text-left">
          © 2025 SecretWhisper. Tous droits réservés.
        </p>
        <p className="text-sm mt-2">
              Créé par{" "}
              <a href="https://linktr.ee/Hassandalmo" className="underline hover:text-blue-400">
                Hassan dalmo | Etudiant UPC😊
              </a>
            </p>
        <div className="mt-1 sm:mt-0">
          <Link
            href="/about"
            className="text-indigo-300 hover:text-indigo-100 transition duration-200 text-xs sm:text-sm"
          >
            À propos
          </Link>
        </div>
      </div>
    </footer>
  );
}