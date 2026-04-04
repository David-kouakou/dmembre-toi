import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

const Profile = () => {
  const { user, loading, userProfile, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    city: '',
    neighborhood: '',
    country: "Côte d'Ivoire"
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login?redirect=/profile');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        fullName: userProfile.fullName || '',
        phone: userProfile.phone || '',
        city: userProfile.city || '',
        neighborhood: userProfile.neighborhood || '',
        country: userProfile.country || "Côte d'Ivoire"
      });
    }
  }, [userProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUserProfile(formData);
      toast.success('✅ Profil mis à jour avec succès');
    } catch (error) {
      toast.error('❌ Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="pt-32 text-center">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="pt-32 pb-20 bg-white min-h-screen">
      <Toaster position="top-center" />
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">Mon profil</h1>
          <div className="w-20 h-1 bg-red-500 mx-auto rounded-full"></div>
        </motion.div>

        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nom complet</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Téléphone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="XX XX XX XX XX"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Quartier</label>
            <input
              type="text"
              name="neighborhood"
              value={formData.neighborhood}
              onChange={handleChange}
              placeholder="Cocody, Plateau, Marcory..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Ville</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Abidjan"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Pays</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option>Côte d'Ivoire</option>
              <option>France</option>
              <option>Sénégal</option>
              <option>Cameroun</option>
            </select>
          </div>
          
          <div className="border-t pt-4">
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-lg">{user.email}</p>
          </div>
          
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </form>

        <div className="mt-6 flex justify-center gap-4">
          <Link to="/orders">
            <button className="bg-gray-200 text-black px-6 py-2 rounded-full hover:bg-gray-300 transition-colors">
              Voir mes commandes
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;