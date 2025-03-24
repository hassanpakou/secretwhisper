import { Suspense } from "react";
import DashboardContent from "./DashboardContent";

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-100"><p className="text-gray-600 text-lg">Chargement...</p></div>}>
      <DashboardContent />
    </Suspense>
  );
}