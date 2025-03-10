declare global {
  namespace NodeJS {
    interface ProcessEnv {
      FIREBASE_apiKey: string;
      FIREBASE_authDomain: string;
      FIREBASE_projectId: string;
      FIREBASE_storageBucket: string;
      FIREBASE_messagingSenderId: string;
      FIREBASE_appId: string;
    }
  }
}

export {}
