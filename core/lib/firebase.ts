import { firebaseConfig } from "@/firebase-config";
import { FirebaseApp, initializeApp } from "firebase/app";

declare global {
  var fb: FirebaseApp | null;
}

export const app = globalThis.fb || initializeApp(firebaseConfig);

if (process.env.NODE_ENV !== "production") {
  globalThis.fb = app;
}
