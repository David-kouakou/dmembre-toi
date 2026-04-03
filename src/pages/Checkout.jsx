import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import toast, { Toaster } from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, totalPrice, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    city: '',
    neighborhood: '',
    country: "Côte d'Ivoire",
    email: ''
  });

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = async () => {
    // Vérifier les champs obligatoires
    const requiredFields = ['fullName', 'phone', 'city', 'neighborhood'];
    const isValid = requiredFields.every(field => formData[field].trim() !== '');
    
    if (!isValid) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsProcessing(true);
    
    const orderId = 'ORD-' + Date.now();
    
    const order = {
      id: orderId,
      items: cart.map(item => ({
        product_id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.selectedSize,
        color: item.selectedColor,
        image: item.images?.[0] || ''
      })),
      total: totalPrice,
      shipping_address: {
        full_name: formData.fullName,
        phone: formData.phone,
        city: formData.city,
        neighborhood: formData.neighborhood,
        country: formData.country,
        email: formData.email || 'non renseigné'
      },
      payment_method: 'cash_on_delivery',
      status: 'pending',
      created_at: new Date().toISOString()
    };
    
    try {
      await addDoc(collection(db, 'orders'), order);
      clearCart();
      
      // Sauvegarder l'email pour le suivi
      if (formData.email) {
        localStorage.setItem('lastOrderEmail', formData.email);
      }
      
      toast.success('✅ Commande validée avec succès !');
      
      // Redirection vers la page de confirmation avec la facture
      setTimeout(() => {
        navigate(`/confirmation?orderId=${orderId}&email=${encodeURIComponent(formData.email || '')}`);
      }, 2000);
      
    } catch (error) {
      console.error('Erreur lors de la commande:', error);
      toast.error('❌ Une erreur est survenue');
    } finally {
      setIsProcessing(false);
    }
  };

  const deliveryFee = 0;
  const totalWithDelivery = totalPrice + deliveryFee;

  if (cart.length === 0) {
    return null;
  }

  return (
    <div className="pt-28 pb-20 bg-gray-50 min-h-screen">
      <Toaster position="top-center" />
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <Link to="/cart">
            <button className="flex items-center gap-2 text-gray-500 hover:text-black mb-4 transition-colors">
              <ArrowLeftIcon className="w-4 h-4" />
              <span className="text-sm">Retour au panier</span>
            </button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">Finaliser ma commande</h1>
          <p className="text-gray-500 mt-2">Vos informations de livraison</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <h2 className="text-xl font-bold mb-6">Informations de livraison</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nom complet <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Jean Kouadio"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Téléphone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="XX XX XX XX XX"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Ville <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Abidjan"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Quartier <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="neighborhood"
                    value={formData.neighborhood}
                    onChange={handleInputChange}
                    placeholder="Cocody, Plateau, Marcory..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Pays</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option>Côte d'Ivoire</option>
                    <option>France</option>
                    <option>Sénégal</option>
                    <option>Cameroun</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email <span className="text-gray-400 text-xs font-normal">(facultatif - pour recevoir votre facture)</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="votre@email.com"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">Renseignez votre email pour recevoir votre facture par email</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t">
                <h3 className="text-lg font-semibold mb-3">Mode de paiement</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">💰</span>
                    </div>
                    <div>
                      <p className="font-medium">Paiement à la livraison</p>
                      <p className="text-sm text-gray-500">Vous payez à la réception de votre commande</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className={`w-full mt-6 bg-red-500 text-white py-3 rounded-full font-semibold transition-colors ${
                  isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600'
                }`}
              >
                {isProcessing ? 'Traitement en cours...' : `Confirmer la commande - ${Math.round(totalWithDelivery).toLocaleString('fr-FR')} FCFA`}
              </button>
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-28">
              <h2 className="text-lg font-bold mb-4">Récapitulatif</h2>
              
              <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                {cart.map((item, index) => (
                  <div key={index} className="flex gap-3 text-sm">
                    <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
                      {item.images && item.images[0] ? (
                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover rounded-md" />
                      ) : (
                        <span className="text-gray-400 text-xs">Img</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium line-clamp-1">{item.name}</p>
                      <p className="text-gray-500 text-xs">{item.selectedColor} / {item.selectedSize}</p>
                      <p className="text-gray-500 text-xs">Qté: {item.quantity}</p>
                    </div>
                    <p className="font-medium">{Math.round(item.price * item.quantity).toLocaleString('fr-FR')} FCFA</p>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span>{Math.round(totalPrice).toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Livraison</span>
                  <span>Gratuite</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-red-500">{Math.round(totalWithDelivery).toLocaleString('fr-FR')} FCFA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;