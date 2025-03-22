import { Suspense } from "react";
import ShareContent from "./ShareContent";

export default function Share() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-100"><p className="text-gray-600 text-lg">Chargement...</p></div>}>
      <ShareContent />
    </Suspense>
  );
}