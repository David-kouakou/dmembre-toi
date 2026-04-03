import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [showUid, setShowUid] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login?redirect=/profile');
    }
  }, [user, loading, navigate]);

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

  // Masquer une partie de l'UID
  const hideUid = (uid) => {
    if (!uid) return '';
    const start = uid.substring(0, 6);
    const end = uid.substring(uid.length - 4);
    return `${start}...${end}`;
  };

  return (
    <div className="pt-32 pb-20 bg-white min-h-screen">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">Mon profil</h1>
          <div className="w-20 h-1 bg-red-500 mx-auto rounded-full"></div>
        </motion.div>

        <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
          <div className="border-b pb-3">
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-lg font-medium">{user.email}</p>
          </div>
          <div className="border-b pb-3">
            <p className="text-sm text-gray-500">Identifiant unique (UID)</p>
            <div className="flex items-center gap-2">
              <p className="text-sm font-mono text-gray-600">
                {showUid ? user.uid : hideUid(user.uid)}
              </p>
              <button
                onClick={() => setShowUid(!showUid)}
                className="text-xs text-red-500 hover:text-red-600"
              >
                {showUid ? 'Masquer' : 'Afficher'}
              </button>
            </div>
          </div>
          <div className="border-b pb-3">
            <p className="text-sm text-gray-500">Compte créé le</p>
            <p className="text-lg">{new Date(user.metadata.creationTime).toLocaleDateString('fr-FR')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Dernière connexion</p>
            <p className="text-lg">{new Date(user.metadata.lastSignInTime).toLocaleDateString('fr-FR')}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Link to="/orders">
            <button className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors">
              Voir mes commandes
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;