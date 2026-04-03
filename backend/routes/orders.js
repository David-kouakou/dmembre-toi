const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');

// GET toutes les commandes
router.get('/', async (req, res) => {
  try {
    const { user_id } = req.query;
    let query = db.collection('orders').orderBy('created_at', 'desc');
    
    if (user_id) {
      query = query.where('user_id', '==', user_id);
    }
    
    const snapshot = await query.get();
    const orders = [];
    snapshot.forEach(doc => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET commande par ID
router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection('orders').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST créer une commande
router.post('/', async (req, res) => {
  try {
    const orderData = {
      ...req.body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const docRef = await db.collection('orders').add(orderData);
    const newDoc = await docRef.get();
    res.status(201).json({ id: newDoc.id, ...newDoc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH mettre à jour le statut
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.query;
    const orderRef = db.collection('orders').doc(req.params.id);
    const doc = await orderRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }
    
    await orderRef.update({
      status: status,
      updated_at: new Date().toISOString()
    });
    
    const updatedDoc = await orderRef.get();
    res.json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;