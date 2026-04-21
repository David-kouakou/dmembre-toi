import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DocumentArrowDownIcon, EyeIcon } from '@heroicons/react/24/outline';
import { generateInvoicePDF } from '../components/Invoice';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

const Orders = () => {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoadingOrders(false);
        return;
      }
      
      try {
        setLoadingOrders(true);
        const q = query(
          collection(db, 'orders'),
          where('user_id', '==', user.uid),
          orderBy('created_at', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const userOrders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(userOrders);
      } catch (error) {
        console.error('Erreur:', error);
        setOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    };
    
    fetchOrders();
  }, [user]);

  const getStatusLabel = (status) => {
    switch(status) {
      case 'pending': return 'En attente';
      case 'processing': return 'En traitement';
      case 'shipped': return 'Expédiée';
      case 'delivered': return 'Livrée';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'shipped': return 'bg-purple-100 text-purple-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading || loadingOrders) {
    return <div className="pt-32 text-center">Chargement...</div>;
  }

  if (!user) {
    return (
      <div className="pt-32 pb-20 bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-6">Mes commandes</h1>
          <div className="bg-gray-50 rounded-2xl p-12">
            <p className="text-gray-500 text-lg mb-4">Connectez-vous pour voir vos commandes</p>
            <Link to="/login">
              <button className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800">
                Se connecter
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Mes commandes</h1>
          <div className="bg-white rounded-2xl p-12 text-center">
            <p className="text-gray-500 text-lg mb-6">Vous n'avez pas encore de commandes</p>
            <Link to="/shop">
              <button className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800">
                Découvrir nos produits
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Mes commandes</h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Commande du</p>
                  <p className="font-medium">{new Date(order.created_at).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">N° commande</p>
                  <p className="font-mono text-sm">{order.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="font-bold text-red-500">{Math.round(order.total).toLocaleString('fr-FR')} FCFA</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Statut</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-2">Articles :</p>
                <div className="space-y-1">
                  {order.items.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{item.name} x{item.quantity}</span>
                      <span>{Math.round(item.price * item.quantity).toLocaleString('fr-FR')} FCFA</span>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <p className="text-sm text-gray-500">+{order.items.length - 3} autre(s) article(s)</p>
                  )}
                </div>
              </div>
              
              <div className="border-t pt-4 mt-4 flex justify-end gap-3">
                <button
                  onClick={() => generateInvoicePDF(order)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  <DocumentArrowDownIcon className="w-4 h-4" />
                  Télécharger facture
                </button>
                <button
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowDetailsModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  <EyeIcon className="w-4 h-4" />
                  Détails
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Détails */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">Détails de la commande</h2>
              <button onClick={() => setShowDetailsModal(false)} className="text-gray-400">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-4 pb-4 border-b">
              <div><p className="text-sm text-gray-500">N° commande</p><p className="font-mono text-sm">{selectedOrder.id}</p></div>
              <div><p className="text-sm text-gray-500">Date</p><p>{new Date(selectedOrder.created_at).toLocaleString('fr-FR')}</p></div>
              <div><p className="text-sm text-gray-500">Paiement</p><p>Paiement à la livraison</p></div>
              <div><p className="text-sm text-gray-500">Statut</p><span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>{getStatusLabel(selectedOrder.status)}</span></div>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Livraison</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>Nom:</strong> {selectedOrder.shipping_address?.full_name}</p>
                <p><strong>Téléphone:</strong> {selectedOrder.shipping_address?.phone}</p>
                <p><strong>Adresse:</strong> {selectedOrder.shipping_address?.neighborhood}, {selectedOrder.shipping_address?.city}</p>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Articles</h3>
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between border-b pb-2">
                  <div><p>{item.name}</p><p className="text-sm text-gray-500">{item.color} / {item.size} x{item.quantity}</p></div>
                  <p>{Math.round(item.price * item.quantity).toLocaleString('fr-FR')} FCFA</p>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 flex justify-between font-bold">
              <span>Total</span>
              <span className="text-red-500">{Math.round(selectedOrder.total).toLocaleString('fr-FR')} FCFA</span>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => generateInvoicePDF(selectedOrder)} className="flex-1 bg-black text-white py-2 rounded-lg">Télécharger facture</button>
              <button onClick={() => setShowDetailsModal(false)} className="flex-1 border py-2 rounded-lg">Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;