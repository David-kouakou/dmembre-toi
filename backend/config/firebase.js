const admin = require('firebase-admin');

// Pour Render, on utilise les variables d'environnement
// Le fichier serviceAccountKey.json ne doit PAS être commité

// Tu devras ajouter la variable d'environnement FIREBASE_SERVICE_ACCOUNT sur Render
// avec le contenu du fichier JSON

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { admin, db, bucket };