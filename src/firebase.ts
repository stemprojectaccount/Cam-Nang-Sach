/// <reference types="vite/client" />
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import localConfig from '../firebase-applet-config.json';

const getConfigValue = (envVal: string | undefined, localVal: string) => {
  if (envVal && envVal !== "undefined" && envVal.trim() !== "") {
    // Check if the envVal is accidentally a JSON string fragment like `"apiKey": "AIzaSy..."`
    if (envVal.includes('"') || envVal.includes(':')) {
      // If it looks malformed, we try to extract the AIza key or fallback to localVal
      const match = envVal.match(/AIza[a-zA-Z0-9_-]+/);
      if (match) return match[0];
      return localVal;
    }
    return envVal;
  }
  return localVal;
};

const firebaseConfig = {
  apiKey: getConfigValue(import.meta.env.VITE_FIREBASE_API_KEY, localConfig.apiKey),
  authDomain: getConfigValue(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN, localConfig.authDomain),
  projectId: getConfigValue(import.meta.env.VITE_FIREBASE_PROJECT_ID, localConfig.projectId),
  storageBucket: getConfigValue(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET, localConfig.storageBucket),
  messagingSenderId: getConfigValue(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID, localConfig.messagingSenderId),
  appId: getConfigValue(import.meta.env.VITE_FIREBASE_APP_ID, localConfig.appId),
  // Always use localConfig for databaseId in the preview environment to avoid mismatches
  firestoreDatabaseId: localConfig.firestoreDatabaseId || getConfigValue(import.meta.env.VITE_FIREBASE_DATABASE_ID, localConfig.firestoreDatabaseId)
};
console.log("Firebase config apiKey:", firebaseConfig.apiKey);

import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const storage = getStorage(app);
export const auth = getAuth(app);
