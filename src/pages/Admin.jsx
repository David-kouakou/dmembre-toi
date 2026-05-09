import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { productApi } from '../lib/api';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import toast, { Toaster } from 'react-hot-toast';

const Admin = () => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'sans-manches',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['noir'],
    stock: '',
    featured: false,
    images: []
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login?redirect=/admin');
    }
    if (!loading && user && !isAdmin) {
      navigate('/');
    }
  }, [user, loading, isAdmin, navigate]);

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const response = await productApi.getAll({ limit: 100 });
      setProducts(response.data || []);
    } catch (error) {
      console.error('Erreur fetch:', error);
      toast.error('Erreur chargement produits');
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce produit ?')) return;
    
    try {
      await productApi.delete(id);
      toast.success('Produit supprimé');
      await fetchProducts();
    } catch (error) {
      console.error('Erreur delete:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      price: product.price?.toString() || '',
      description: product.description || '',
      category: product.category || 'sans-manches',
      sizes: product.sizes || ['S', 'M', 'L', 'XL'],
      colors: product.colors || ['noir'],
      stock: product.stock?.toString() || '',
      featured: product.featured || false,
      images: product.images || []
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      description: '',
      category: 'sans-manches',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['noir'],
      stock: '',
      featured: false,
      images: []
    });
    setShowModal(true);
  };

  const uploadImage = async (file) => {
    setUploading(true);
    const data = new FormData();
    data.append('file', file);
    
    try {
      const response = await fetch('https://dmembre-toi-backend-api.onrender.com/api/v1/upload/image', {
        method: 'POST',
        body: data,
      });
      const result = await response.json();
      if (result.success) {
        toast.success('Image uploadée');
        return result.url;
      }
      return null;
    } catch (error) {
      console.error('Erreur upload:', error);
      toast.error('Erreur upload image');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    // Validation
    if (!formData.name || !formData.price || !formData.stock) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        category: formData.category,
        sizes: formData.sizes,
        colors: formData.colors,
        stock: parseInt(formData.stock),
        featured: formData.featured,
        images: formData.images.length > 0 ? formData.images : ['https://res.cloudinary.com/demo/image/upload/v1/samples/placeholder.jpg']
      };

      if (editingProduct) {
        await productApi.update(editingProduct.id, productData);
        toast.success('Produit modifié');
      } else {
        await productApi.create(productData);
        toast.success('Produit ajouté');
      }
      setShowModal(false);
      await fetchProducts();
    } catch (error) {
      console.error('Erreur save:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  if (loading || loadingProducts) {
    return (
      <div className="pt-32 text-center">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
      <Toaster position="top-center" />
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard Admin</h1>
          <button 
            onClick={handleAdd} 
            className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition"
          >
            <PlusIcon className="w-5 h-5" />
            Ajouter un produit
          </button>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Produits ({products.length})</h2>
          {products.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Aucun produit pour le moment</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr className="text-left">
                    <th className="py-2">Nom</th>
                    <th className="py-2">Prix</th>
                    <th className="py-2">Stock</th>
                    <th className="py-2">Catégorie</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="py-2">{product.name}</td>
                      <td className="py-2">{Math.round(product.price).toLocaleString('fr-FR')} FCFA</td>
                      <td className="py-2">{product.stock}</td>
                      <td className="py-2">{product.category}</td>
                      <td className="py-2">
                        <button 
                          onClick={() => handleEdit(product)} 
                          className="text-blue-600 hover:text-blue-800 mr-3 transition"
                          title="Modifier"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)} 
                          className="text-red-600 hover:text-red-800 transition"
                          title="Supprimer"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal Ajout/Modification */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-4">
              {editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
            </h2>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Nom du produit *" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="number" 
                  placeholder="Prix *" 
                  value={formData.price} 
                  onChange={(e) => setFormData({...formData, price: e.target.value})} 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                />
                <input 
                  type="number" 
                  placeholder="Stock *" 
                  value={formData.stock} 
                  onChange={(e) => setFormData({...formData, stock: e.target.value})} 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>
              <textarea 
                placeholder="Description" 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
                rows={3} 
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
              />
              <select 
                value={formData.category} 
                onChange={(e) => setFormData({...formData, category: e.target.value})} 
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
              >
                <option value="sans-manches">Sans Manches</option>
                <option value="hoodie-sans-manches">Hoodies Sans Manches</option>
                <option value="veste-jean-sans-manches">Vestes Jean Sans Manches</option>
              </select>
              <input 
                type="text" 
                placeholder="Couleurs (ex: noir, blanc)" 
                value={formData.colors.join(', ')} 
                onChange={(e) => setFormData({...formData, colors: e.target.value.split(',').map(c => c.trim())})} 
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input 
                type="text" 
                placeholder="Tailles (ex: S, M, L, XL)" 
                value={formData.sizes.join(', ')} 
                onChange={(e) => setFormData({...formData, sizes: e.target.value.split(',').map(s => s.trim())})} 
                className="w-full px-4 py-2 border rounded-lg"
              />
              <div>
                <label className="block text-sm font-medium mb-2">Image du produit</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={async (e) => {
                    if (e.target.files?.[0]) {
                      const url = await uploadImage(e.target.files[0]);
                      if (url) setFormData({...formData, images: [url]});
                    }
                  }} 
                  className="w-full px-4 py-2 border rounded-lg"
                  disabled={uploading}
                />
                {uploading && <p className="text-xs text-gray-500 mt-1">Upload en cours...</p>}
                {formData.images[0] && (
                  <img 
                    src={formData.images[0]} 
                    alt="Aperçu" 
                    className="w-20 h-20 object-cover rounded mt-2 border"
                  />
                )}
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.featured} 
                  onChange={(e) => setFormData({...formData, featured: e.target.checked})} 
                  className="w-4 h-4"
                />
                <span className="text-sm">Mettre en avant (produit vedette)</span>
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button 
                onClick={handleSave} 
                className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
              >
                Enregistrer
              </button>
              <button 
                onClick={() => setShowModal(false)} 
                className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;