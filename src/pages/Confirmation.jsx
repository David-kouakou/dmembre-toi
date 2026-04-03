import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { generateInvoicePDF } from '../components/Invoice';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import toast, { Toaster } from 'react-hot-toast';

const Confirmation = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const emailParam = searchParams.get('email');
  const [order, setOrder] = useState(null);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (orderId) {
        try {
          const q = query(collection(db, 'orders'), where('id', '==', orderId));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const orderData = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
            setOrder(orderData);
            
            // Envoyer l'email de confirmation si l'email est fourni
            if (orderData.shipping_address?.email && orderData.shipping_address.email !== 'non renseigné' && !emailSent) {
              await sendConfirmationEmail(orderData);
              setEmailSent(true);
            }
          }
        } catch (error) {
          console.error('Erreur:', error);
        }
      }
    };
    fetchOrder();
  }, [orderId]);

  const sendConfirmationEmail = async (order) => {
    // Simulation d'envoi d'email
    console.log('Email envoyé à:', order.shipping_address.email);
    toast.success(`📧 Un email de confirmation a été envoyé à ${order.shipping_address.email}`);
  };

  if (!order) {
    return (
      <div className="pt-32 pb-20 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Chargement de votre commande...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
      <Toaster position="top-center" />
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
            <p className="text-gray-600 mb-2">
              Vous serez informé de l'état de votre commande par SMS.
            </p>
            {order.shipping_address?.email && order.shipping_address.email !== 'non renseigné' && (
              <p className="text-gray-600">
                Un email de confirmation a été envoyé à <strong>{order.shipping_address.email}</strong>
              </p>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/shop" className="flex-1">
              <button className="w-full border-2 border-black text-black py-3 rounded-full font-semibold hover:bg-black hover:text-white transition-colors">
                Continuer mes achats
              </button>
            </Link>
            <button
              onClick={() => generateInvoicePDF(order)}
              className="flex-1 bg-black text-white py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <DocumentArrowDownIcon className="w-5 h-5" />
              Télécharger la facture
            </button>
            <Link to={`/orders?email=${encodeURIComponent(order.shipping_address?.email || '')}`} className="flex-1">
              <button className="w-full border-2 border-red-500 text-red-500 py-3 rounded-full font-semibold hover:bg-red-500 hover:text-white transition-colors">
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