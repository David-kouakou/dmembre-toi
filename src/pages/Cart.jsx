import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, totalItems, totalPrice, clearCart } = useCart();

  // Frais de livraison fixes à 1500 FCFA
  const deliveryFee = 1500;
  const totalWithDelivery = totalPrice + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="pt-32 pb-20 bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Votre panier</h1>
          <div className="bg-gray-50 rounded-2xl p-12">
            <p className="text-gray-500 text-lg mb-6">Votre panier est vide</p>
            <Link to="/shop">
              <button className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors">
                Découvrir nos produits
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Votre panier</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Liste des produits */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <motion.div
                key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-50 rounded-2xl p-4 flex gap-4"
              >
                {/* Image */}
                <div className="w-24 h-24 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                  {item.images && item.images[0] ? (
                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <span className="text-gray-400 text-xs">Image</span>
                  )}
                </div>
                
                {/* Infos produit */}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                  <p className="text-gray-500 text-sm mb-1">
                    {item.selectedColor} / {item.selectedSize}
                  </p>
                  <p className="text-red-500 font-semibold">
                    {Math.round(item.price).toLocaleString('fr-FR')} FCFA
                  </p>
                </div>
                
                {/* Quantité et suppression */}
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <MinusIcon className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Résumé */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-2xl p-6 sticky top-28">
              <h2 className="text-xl font-bold mb-4">Résumé de la commande</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Articles ({totalItems})</span>
                  <span>{Math.round(totalPrice).toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Livraison</span>
                  <span>1 500 FCFA</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-red-500">{Math.round(totalWithDelivery).toLocaleString('fr-FR')} FCFA</span>
                </div>
              </div>
              
              <Link to="/checkout">
                <button className="w-full bg-black text-white py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors mb-3">
                  Commander
                </button>
              </Link>
              
              <button
                onClick={clearCart}
                className="w-full border border-gray-300 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
              >
                Vider le panier
              </button>
              
              <Link to="/shop">
                <p className="text-center text-sm text-gray-500 mt-4 hover:text-black transition-colors">
                  ← Continuer mes achats
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;