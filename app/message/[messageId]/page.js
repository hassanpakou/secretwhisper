import { Suspense } from "react";
import MessageContent from "./MessageContent";

export default function Message() {
  return (
    <Suspense
      fallback={
        <div className="bg-white flex flex-col items-center justify-center p-4">
          <div
            className="w-full text-center py-12 rounded-b-3xl"
            style={{
              background: "linear-gradient(to right, #FF0004FF, #1E00FFFF)",
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