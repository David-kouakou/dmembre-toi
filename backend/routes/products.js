const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');

// GET tous les produits
router.get('/', async (req, res) => {
  try {
    const { limit = 50, featured } = req.query;
    let query = db.collection('products').orderBy('created_at', 'desc').limit(parseInt(limit));
    
    if (featured === 'true') {
      query = query.where('featured', '==', true);
    }
    
    const snapshot = await query.get();
    const products = [];
    snapshot.forEach(doc => {
      products.push({ id: doc.id, ...doc.data() });
    });
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET produit par ID
router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection('products').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST créer un produit
router.post('/', async (req, res) => {
  try {
    const productData = {
      ...req.body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const docRef = await db.collection('products').add(productData);
    const newDoc = await docRef.get();
    res.status(201).json({ id: newDoc.id, ...newDoc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT modifier un produit
router.put('/:id', async (req, res) => {
  try {
    const productRef = db.collection('products').doc(req.params.id);
    const doc = await productRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    
    await productRef.update({
      ...req.body,
      updated_at: new Date().toISOString()
    });
    
    const updatedDoc = await productRef.get();
    res.json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE supprimer un produit
router.delete('/:id', async (req, res) => {
  try {
    const productRef = db.collection('products').doc(req.params.id);
    const doc = await productRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    
    await productRef.delete();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;