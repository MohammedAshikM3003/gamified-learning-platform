const admin = require("firebase-admin");

const getFirestore = () => {
  if (admin.apps.length > 0) {
    return admin.firestore();
  }

  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;

  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
    const error = new Error("Missing Firestore credentials in environment variables.");
    error.statusCode = 500;
    throw error;
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });

  return admin.firestore();
};

module.exports = { getFirestore };
