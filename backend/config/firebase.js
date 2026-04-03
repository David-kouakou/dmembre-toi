const admin = require('firebase-admin');

// Pour Render : utilise la variable d'environnement
// Pour le développement local : utilise le fichier JSON
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // En production sur Render
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  // En développement local
  try {
    serviceAccount = require('./serviceAccountKey.json');
  } catch (error) {
    console.error('❌ Fichier serviceAccountKey.json manquant');
    console.error('   Copie ton fichier JSON dans backend/config/');
    process.exit(1);
  }
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'dmembre-toi.appspot.com'
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { admin, db, bucket };