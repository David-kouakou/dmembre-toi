import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { productApi } from '../lib/api';
import { listenActiveUsersCount } from '../lib/userTracking';
import { 
  TrashIcon, 
  PencilIcon, 
  PlusIcon, 
  EyeIcon, 
  CheckCircleIcon, 
  TruckIcon, 
  CubeIcon 
} from '@heroicons/react/24/outline';

const Admin = () => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState(null);
  const [activeUsers, setActiveUsers] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
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

  // Écouter le nombre d'utilisateurs connectés
  useEffect(() => {
    const unsubscribe = listenActiveUsersCount((count) => {
      setActiveUsers(count);
    });
    return () => unsubscribe();
  }, []);

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
      setError(null);
      const response = await productApi.getAll({ limit: 100 });
      setProducts(response.data);
    } catch (error) {
      console.error('Erreur fetch produits:', error);
      setError(error.message);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchOrders = () => {
    try {
      const savedOrders = localStorage.getItem('orders');
      if (savedOrders) {
        const allOrders = JSON.parse(savedOrders);
        setOrders(allOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const uploadImage = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('https://dmembre-toi-backend-api.onrender.com/api/v1/upload/image', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        alert('Image uploadée avec succès !');
        return data.url;
      }
      return null;
    } catch (error) {
      console.error('Erreur upload:', error);
      alert('Erreur de connexion au serveur');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    alert(`Statut mis à jour : ${getStatusLabel(newStatus)}`);
  };

  const handleDelete = async (id) => {
    if (confirm('Supprimer ce produit ?')) {
      try {
        await productApi.delete(id);
        await fetchProducts();
        alert('Produit supprimé');
      } catch (error) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      category: product.category,
      sizes: product.sizes,
      colors: product.colors,
      stock: product.stock.toString(),
      featured: product.featured,
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

  const handleSave = async () => {
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
        alert('Produit modifié');
      } else {
        await productApi.create(productData);
        alert('Produit ajouté');
      }
      setShowModal(false);
      await fetchProducts();
    } catch (error) {
      alert('Erreur lors de la sauvegarde');
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

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

  const getStatusActions = (order) => {
    const actions = [];
    if (order.status === 'pending') {
      actions.push({ status: 'processing', label: 'En traitement', icon: CubeIcon });
    }
    if (order.status === 'processing') {
      actions.push({ status: 'shipped', label: 'Expédiée', icon: TruckIcon });
    }
    if (order.status === 'shipped') {
      actions.push({ status: 'delivered', label: 'Livrée', icon: CheckCircleIcon });
    }
    return actions;
  };

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  if (loading || loadingProducts || loadingOrders) {
    return <div className="pt-32 text-center">Chargement...</div>;
  }

  if (error) {
    return (
      <div className="pt-32 text-center">
        <p className="text-red-500">Erreur: {error}</p>
        <button onClick={fetchProducts} className="mt-4 bg-black text-white px-4 py-2 rounded">Réessayer</button>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Dashboard Admin</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total produits</p>
            <p className="text-3xl font-bold">{products.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total commandes</p>
            <p className="text-3xl font-bold">{totalOrders}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-gray-500">Commandes en attente</p>
            <p className="text-3xl font-bold text-yellow-600">{pendingOrders}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-gray-500">Chiffre d'affaires</p>
            <p className="text-3xl font-bold text-green-600">{Math.round(totalRevenue).toLocaleString('fr-FR')} FCFA</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-gray-500">Utilisateurs en ligne</p>
            <p className="text-3xl font-bold text-blue-600">{activeUsers}</p>
          </div>
        </div>

        <div className="flex gap-4 mb-6 border-b">
          <button onClick={() => setActiveTab('products')} className={`pb-3 px-4 font-medium ${activeTab === 'products' ? 'border-b-2 border-red-500 text-red-500' : 'text-gray-500'}`}>
            Produits
          </button>
          <button onClick={() => setActiveTab('orders')} className={`pb-3 px-4 font-medium ${activeTab === 'orders' ? 'border-b-2 border-red-500 text-red-500' : 'text-gray-500'}`}>
            Commandes
          </button>
        </div>

        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Produits</h2>
              <button onClick={handleAdd} className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <PlusIcon className="w-5 h-5" /> Ajouter
              </button>
            </div>
            {products.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Aucun produit trouvé.</p>
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
                        <td className="py-2 font-medium">{product.name}</td>
                        <td className="py-2">{Math.round(product.price).toLocaleString('fr-FR')} FCFA</td>
                        <td className="py-2">{product.stock}</td>
                        <td className="py-2">{product.category}</td>
                        <td className="py-2">
                          <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-800 mr-3">
                            <PencilIcon className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800">
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
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Commandes</h2>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border rounded-lg">
                <option value="all">Tous</option>
                <option value="pending">En attente</option>
                <option value="processing">En traitement</option>
                <option value="shipped">Expédiée</option>
                <option value="delivered">Livrée</option>
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr className="text-left">
                    <th className="py-2">N° commande</th>
                    <th className="py-2">Date</th>
                    <th className="py-2">Client</th>
                    <th className="py-2">Total</th>
                    <th className="py-2">Statut</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 font-mono text-xs">{order.id}</td>
                      <td className="py-2">{new Date(order.created_at).toLocaleDateString('fr-FR')}</td>
                      <td className="py-2">{order.shipping_address?.first_name} {order.shipping_address?.last_name}</td>
                      <td className="py-2 font-semibold">{Math.round(order.total).toLocaleString('fr-FR')} FCFA</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="py-2">
                        <button onClick={() => viewOrderDetails(order)} className="text-blue-600 hover:text-blue-800">
                          <EyeIcon className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal Produit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-4">{editingProduct ? 'Modifier' : 'Ajouter'} un produit</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Nom" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Prix" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                <input type="number" placeholder="Stock" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={3} className="w-full px-4 py-2 border rounded-lg" />
              <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2 border rounded-lg">
                <option value="sans-manches">Sans Manches</option>
                <option value="hoodie-sans-manches">Hoodies Sans Manches</option>
                <option value="veste-jean-sans-manches">Vestes Jean Sans Manches</option>
              </select>
              <input type="text" placeholder="Couleurs (séparées par des virgules)" value={formData.colors.join(', ')} onChange={(e) => setFormData({...formData, colors: e.target.value.split(', ').map(c => c.trim())})} className="w-full px-4 py-2 border rounded-lg" />
              <input type="text" placeholder="Tailles (séparées par des virgules)" value={formData.sizes.join(', ')} onChange={(e) => setFormData({...formData, sizes: e.target.value.split(', ').map(s => s.trim())})} className="w-full px-4 py-2 border rounded-lg" />
              <input type="file" accept="image/*" onChange={async (e) => {
                if (e.target.files?.[0]) {
                  const url = await uploadImage(e.target.files[0]);
                  if (url) setFormData({...formData, images: [url]});
                }
              }} className="w-full px-4 py-2 border rounded-lg" />
              {uploading && <p className="text-xs text-gray-500">Upload en cours...</p>}
              {formData.images[0] && <img src={formData.images[0]} alt="Aperçu" className="w-20 h-20 object-cover rounded" />}
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({...formData, featured: e.target.checked})} />
                Mettre en avant
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} className="flex-1 bg-black text-white py-2 rounded-lg">Enregistrer</button>
              <button onClick={() => setShowModal(false)} className="flex-1 border py-2 rounded-lg">Annuler</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Détails Commande */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">Détails commande</h2>
              <button onClick={() => setShowOrderModal(false)} className="text-gray-400">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-4 pb-4 border-b">
              <div><p className="text-sm text-gray-500">N° commande</p><p className="font-mono text-sm">{selectedOrder.id}</p></div>
              <div><p className="text-sm text-gray-500">Date</p><p>{new Date(selectedOrder.created_at).toLocaleString('fr-FR')}</p></div>
              <div><p className="text-sm text-gray-500">Paiement</p><p>Paiement à la livraison</p></div>
              <div><p className="text-sm text-gray-500">Statut</p><span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>{getStatusLabel(selectedOrder.status)}</span></div>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Client</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p>{selectedOrder.shipping_address?.first_name} {selectedOrder.shipping_address?.last_name}</p>
                <p>{selectedOrder.shipping_address?.email}</p>
                <p>{selectedOrder.shipping_address?.phone}</p>
                <p>{selectedOrder.shipping_address?.address}</p>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Articles</h3>
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between border-b pb-2">
                  <div>
                    <p>{item.name}</p>
                    <p className="text-sm text-gray-500">{item.color} / {item.size} x{item.quantity}</p>
                  </div>
                  <p>{Math.round(item.price * item.quantity).toLocaleString('fr-FR')} FCFA</p>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 flex justify-between font-bold">
              <span>Total</span>
              <span className="text-red-500">{Math.round(selectedOrder.total).toLocaleString('fr-FR')} FCFA</span>
            </div>
            {selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Changer le statut</h3>
                <div className="flex gap-3 flex-wrap">
                  {getStatusActions(selectedOrder).map((action) => (
                    <button key={action.status} onClick={() => { updateOrderStatus(selectedOrder.id, action.status); setSelectedOrder({...selectedOrder, status: action.status}); }} className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg">
                      <action.icon className="w-4 h-4" /> {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;