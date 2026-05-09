import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { productApi } from '../lib/api';

const Admin = () => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login?redirect=/admin');
    }
    if (!loading && user && !isAdmin) {
      navigate('/');
    }
  }, [user, loading, isAdmin, navigate]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productApi.getAll({ limit: 20 });
        setProducts(response.data);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading || loadingProducts) {
    return <div className="pt-32 text-center">Chargement...</div>;
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Dashboard Admin</h1>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Produits ({products.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="py-2">Nom</th>
                  <th className="py-2">Prix</th>
                  <th className="py-2">Stock</th>
                  <th className="py-2">Catégorie</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b">
                    <td className="py-2">{product.name}</td>
                    <td className="py-2">{Math.round(product.price).toLocaleString('fr-FR')} FCFA</td>
                    <td className="py-2">{product.stock}</td>
                    <td className="py-2">{product.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {products.length === 0 && (
            <p className="text-center text-gray-500 py-8">Aucun produit pour le moment</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;