import { NextResponse } from "next/server";
import * as admin from "firebase-admin";

// Initialise Firebase Admin SDK avec le fichier de compte de service
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require("../../service-account.json")),
  });
}

export async function GET() {
  const db = admin.firestore();
  return NextResponse.json({ message: "API fonctionne avec Firebase Admin" });
}