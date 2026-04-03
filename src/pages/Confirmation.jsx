import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { DocumentArrowDownIcon, EyeIcon } from '@heroicons/react/24/outline';
import { generateInvoicePDF } from '../components/Invoice';

const Confirmation = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (orderId) {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const foundOrder = orders.find((o) => o.id === orderId);
      setOrder(foundOrder);
    }
  }, [orderId]);

  if (!order) {
    return (
      <div className="pt-32 pb-20 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  const customerEmail = order.shipping_address?.email || order.shippingAddress?.email || 'notre service client';

  return (
    <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 text-center shadow-sm"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold mb-2">Merci pour votre commande !</h1>
          <p className="text-gray-500 mb-4">Votre commande a bien été enregistrée</p>
          
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-500">Numéro de commande</p>
            <p className="text-lg font-semibold">{order.id}</p>
          </div>
          
          <div className="border-t pt-6 mb-6">
            <p className="text-gray-600 mb-4">
              Un email de confirmation a été envoyé à <strong>{customerEmail}</strong>
            </p>
            <p className="text-gray-600">
              Vous serez informé de l'état de votre commande par SMS et email.
            </p>
          </div>

          {/* Bouton pour afficher/cacher les détails */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="mb-6 text-red-500 hover:text-red-600 font-medium flex items-center justify-center gap-2 mx-auto"
          >
            <EyeIcon className="w-5 h-5" />
            {showDetails ? 'Masquer les détails' : 'Voir les détails de ma commande'}
          </button>

          {/* Détails de la commande */}
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-50 rounded-xl p-4 mb-6 text-left"
            >
              <h3 className="font-semibold mb-3">Détails de la commande</h3>
              
              {/* Adresse de livraison */}
              <div className="mb-4">
                <p className="text-sm text-gray-500 font-medium mb-1">Livraison</p>
                <p className="text-sm">
                  {order.shipping_address?.first_name || order.shippingAddress?.firstName} {order.shipping_address?.last_name || order.shippingAddress?.lastName}
                </p>
                <p className="text-sm">{order.shipping_address?.address || order.shippingAddress?.address}</p>
                <p className="text-sm">{order.shipping_address?.postal_code || order.shippingAddress?.postalCode} {order.shipping_address?.city || order.shippingAddress?.city}</p>
                <p className="text-sm">{order.shipping_address?.country || order.shippingAddress?.country}</p>
                <p className="text-sm">Tél: {order.shipping_address?.phone || order.shippingAddress?.phone}</p>
              </div>

              {/* Articles commandés */}
              <div className="mb-4">
                <p className="text-sm text-gray-500 font-medium mb-1">Articles</p>
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm border-b pb-1">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-500 text-xs ml-2">({item.color} / {item.size})</span>
                        <span className="text-gray-400 text-xs ml-2">x{item.quantity}</span>
                      </div>
                      <span>{Math.round(item.price * item.quantity).toLocaleString('fr-FR')} FCFA</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mode de paiement */}
              <div className="mb-4">
                <p className="text-sm text-gray-500 font-medium mb-1">Paiement</p>
                <p className="text-sm">Paiement à la livraison</p>
              </div>

              {/* Total */}
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-red-500">{Math.round(order.total).toLocaleString('fr-FR')} FCFA</span>
              </div>
            </motion.div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/shop" className="flex-1">
              <button className="w-full border-2 border-black text-black py-3 rounded-full font-semibold hover:bg-black hover:text-white transition-colors">
                Continuer mes achats
              </button>
            </Link>
            <button
              onClick={() => generateInvoicePDF(order)}
              className="flex-1 border-2 border-black text-black py-3 rounded-full font-semibold hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <DocumentArrowDownIcon className="w-5 h-5" />
              Télécharger la facture
            </button>
            <Link to="/orders" className="flex-1">
              <button className="w-full bg-black text-white py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors">
                Voir mes commandes
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Confirmation;