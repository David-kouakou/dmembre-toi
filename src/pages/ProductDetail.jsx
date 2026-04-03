import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { productApi } from '../lib/api';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productApi.getById(id);
        setProduct(response.data);
        setError(false);
      } catch (err) {
        console.error('Erreur:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const getColorClass = (color) => {
    const colors = {
      noir: 'bg-black',
      blanc: 'bg-white border border-gray-300',
      gris: 'bg-gray-500',
      'gris foncé': 'bg-gray-700',
      beige: 'bg-amber-100',
      'bleu clair': 'bg-blue-300',
      'bleu foncé': 'bg-blue-800',
      'bleu délavé': 'bg-blue-200',
      kaki: 'bg-green-700',
    };
    return colors[color] || 'bg-gray-400';
  };

  const getColorName = (color) => {
    const names = {
      noir: 'Noir',
      blanc: 'Blanc',
      gris: 'Gris',
      'gris foncé': 'Gris Foncé',
      beige: 'Beige',
      'bleu clair': 'Bleu Clair',
      'bleu foncé': 'Bleu Foncé',
      'bleu délavé': 'Bleu Délavé',
      kaki: 'Kaki',
    };
    return names[color] || color;
  };

  const handleAddToCart = () => {
    const sizeToAdd = selectedSize || product?.sizes?.[0];
    const colorToAdd = selectedColor || product?.colors?.[0];
    
    for (let i = 0; i < quantity; i++) {
      addToCart(product, sizeToAdd, colorToAdd);
    }
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pt-32 pb-20 bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-6">Produit non trouvé</h1>
          <p className="text-gray-500 mb-8">Le produit que vous recherchez n'existe pas.</p>
          <Link to="/shop">
            <button className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors">
              Retour à la boutique
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const defaultSize = product.sizes?.[0] || '';
  const defaultColor = product.colors?.[0] || '';

  return (
    <div className="pt-24 sm:pt-28 pb-16 sm:pb-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/shop">
          <button className="flex items-center gap-2 text-gray-500 hover:text-black mb-6 transition-colors">
            <ArrowLeftIcon className="w-4 h-4" />
            <span className="text-sm">Retour à la boutique</span>
          </button>
        </Link>

        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-24 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
          >
            ✓ {quantity} x {product.name} ajouté au panier !
          </motion.div>
        )}

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Section Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-square">
              {product.images && product.images[0] ? (
                <img 
                  src={product.images[0]} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-gray-400 text-sm">Image</span>
                    <p className="text-gray-400 text-xs mt-2">{product.name}</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Miniatures */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.slice(0, 3).map((img, idx) => (
                  <div
                    key={idx}
                    className="w-20 h-20 rounded-lg bg-gray-100 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Section Infos produit */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-3">{product.name}</h1>
              <p className="text-2xl sm:text-3xl font-bold text-red-500">
                {Math.round(product.price).toLocaleString('fr-FR')} FCFA
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Couleurs */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3">
                  Couleurs
                  {selectedColor && (
                    <span className="text-sm text-gray-500 ml-2">
                      : {getColorName(selectedColor)}
                    </span>
                  )}
                </h2>
                <div className="flex gap-3 flex-wrap">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        getColorClass(color)
                      } ${selectedColor === color ? 'ring-2 ring-red-500 ring-offset-2 scale-110' : ''}`}
                      title={getColorName(color)}
                    />
                  ))}
                  {!selectedColor && (
                    <p className="text-xs text-gray-400 mt-2">
                      * Par défaut: {getColorName(product.colors[0])}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Tailles */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3">
                  Tailles
                  {selectedSize && (
                    <span className="text-sm text-gray-500 ml-2">
                      : {selectedSize}
                    </span>
                  )}
                </h2>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-full border-2 font-medium transition-all ${
                        selectedSize === size
                          ? 'bg-black text-white border-black'
                          : 'border-gray-300 text-gray-600 hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                  {!selectedSize && (
                    <p className="text-xs text-gray-400 mt-2 w-full">
                      * Par défaut: {product.sizes[0]}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Quantité */}
            <div>
              <h2 className="text-lg font-semibold mb-3">Quantité</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  -
                </button>
                <span className="text-xl font-medium w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
                <span className="text-sm text-gray-500 ml-2">
                  {product.stock} disponibles
                </span>
              </div>
            </div>

            {/* Stock faible */}
            {product.stock < 10 && product.stock > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-yellow-700 text-sm">
                  ⚡ Plus que {product.stock} exemplaires en stock !
                </p>
              </div>
            )}

            {product.stock === 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">❌ Rupture de stock</p>
              </div>
            )}

            {/* Bouton ajouter au panier */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`w-full py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105 ${
                product.stock === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              {product.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
            </button>

            {/* Livraison info */}
            <div className="border-t pt-6 mt-6">
              <div className="flex items-center gap-3 text-gray-500 text-sm">
                <span>🚚</span>
                <span>Livraison gratuite à partir de 65 000 FCFA</span>
              </div>
              <div className="flex items-center gap-3 text-gray-500 text-sm mt-2">
                <span>🔄</span>
                <span>Retours gratuits sous 14 jours</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;