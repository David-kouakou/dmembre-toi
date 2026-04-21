import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { productApi } from '../lib/api';
import { cache } from '../lib/cache';
import PageLoader from '../components/ui/PageLoader';

const ProductCard = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [showMessage, setShowMessage] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 2000);
  };

  const getColorClass = (color) => {
    const colors = {
      noir: 'bg-black',
      blanc: 'bg-white border',
      gris: 'bg-gray-500',
      beige: 'bg-amber-100',
      'bleu clair': 'bg-blue-300',
      'bleu foncé': 'bg-blue-800'
    };
    return colors[color] || 'bg-gray-400';
  };

  return (
    <div className="group relative">
      <Link to={`/product/${product.id}`}>
        <div className="bg-gray-100 rounded-xl overflow-hidden aspect-square">
          {product.images && product.images[0] ? (
            <img 
              src={product.images[0]} 
              alt={product.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-sm">Image</span>
            </div>
          )}
        </div>
        <h3 className="font-medium mt-2 line-clamp-1">{product.name}</h3>
        <p className="text-red-500 font-bold">{Math.round(product.price).toLocaleString('fr-FR')} FCFA</p>
      </Link>
      
      <div className="mt-2">
        <div className="flex gap-1 mb-2">
          {product.colors?.map(color => (
            <button key={color} onClick={() => setSelectedColor(color)} className={`w-5 h-5 rounded-full border ${getColorClass(color)} ${selectedColor === color ? 'ring-2 ring-red-500' : ''}`} />
          ))}
        </div>
        <div className="flex gap-1 mb-2">
          {product.sizes?.map(size => (
            <button key={size} onClick={() => setSelectedSize(size)} className={`text-xs px-2 py-1 rounded-full border ${selectedSize === size ? 'bg-black text-white' : 'border-gray-300'}`}>
              {size}
            </button>
          ))}
        </div>
        <button 
          onClick={handleAddToCart} 
          disabled={product.stock === 0}
          className={`w-full py-1 rounded-lg text-sm transition-colors ${product.stock === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'}`}
        >
          {product.stock === 0 ? 'Rupture' : 'Ajouter'}
        </button>
      </div>
      {showMessage && <div className="absolute top-0 left-0 right-0 bg-green-500 text-white text-xs text-center py-1 rounded-t-xl">Ajouté !</div>}
    </div>
  );
};

const Shop = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      const cachedProducts = cache.get('products');
      if (cachedProducts) {
        setProducts(cachedProducts);
        setLoading(false);
        return;
      }
      
      try {
        const response = await productApi.getAll({ limit: 50 });
        setProducts(response.data);
        cache.set('products', response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = [
    { id: 'all', name: 'Tous' },
    { id: 'sans-manches', name: 'Sans Manches' },
    { id: 'hoodie-sans-manches', name: 'Hoodies Sans Manches' },
    { id: 'veste-jean-sans-manches', name: 'Vestes Jean Sans Manches' }
  ];

  let filteredProducts = selectedCategory === 'all' ? products : products.filter(p => p.category === selectedCategory);
  
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    );
  }

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="pt-32 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4">
          {searchQuery ? `Résultats pour "${searchQuery}"` : 'Notre collection'}
        </h1>
        <p className="text-gray-600 mb-6">
          {searchQuery ? `${filteredProducts.length} produit(s) trouvé(s)` : 'Des pièces sans manches pour rester stylé'}
        </p>
        
        {!searchQuery && (
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`px-4 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${selectedCategory === cat.id ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
                {cat.name}
              </button>
            ))}
          </div>
        )}
        
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Aucun produit trouvé</p>
            <Link to="/shop" className="bg-black text-white px-6 py-2 rounded-full text-sm hover:bg-gray-800 inline-block">
              Voir tous les produits
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;