const express = require('express');
const router = express.Router();
const { admin, db } = require('../config/firebase');

// Vérifier le token Firebase
router.post('/verify-token', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Token manquant' });
    }
    
    // Vérifier le token
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;
    const email = decodedToken.email || '';
    const name = decodedToken.name || '';
    
    // Vérifier si l'utilisateur est admin
    let isAdmin = false;
    try {
      const userDoc = await db.collection('users').doc(uid).get();
      if (userDoc.exists && userDoc.data().role === 'admin') {
        isAdmin = true;
      }
    } catch (err) {
      console.log('Erreur lecture rôle:', err);
    }
    
    res.json({
      uid,
      email,
      name,
      is_admin: isAdmin
    });
  } catch (error) {
    console.error('Erreur vérification token:', error);
    res.status(401).json({ error: 'Token invalide' });
  }
});

module.exports = router;