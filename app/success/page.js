import { Suspense } from "react";
import SuccessClient from "./SuccessClient";

export default function Success() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-4">Chargement...</div>}>
      <SuccessClient />
    </Suspense>
  );
}