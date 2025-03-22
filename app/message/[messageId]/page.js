import { Suspense } from "react";
import MessageContent from "./MessageContent";

export default function Message() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-100"><p className="text-gray-600 text-lg">Chargement...</p></div>}>
      <MessageContent />
    </Suspense>
  );
}