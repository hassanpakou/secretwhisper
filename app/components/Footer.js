import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black bg-opacity-80 text-white py-2 sm:py-3 w-full">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center px-4 text-xs sm:text-sm">
        <p className="text-center sm:text-left">
          © 2025 SecretWhisper. Tous droits réservés.
        </p>
        <p className="text-center sm:text-right mt-1 sm:mt-0">
          Créé par{" "}
          <a
            href="https://github.com/hassandalmo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-300 hover:text-indigo-100 transition duration-200"
          >
            Hassan dalmo
          </a>{" "}
          | Etudiant UPC 😊
        </p>
      </div>
    </footer>
  );
}