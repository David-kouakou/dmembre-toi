import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { UserCircleIcon } from '@heroicons/react/24/outline';

const AdminUsers = () => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login?redirect=/admin/users');
    }
    if (!loading && user && !isAdmin) {
      navigate('/');
    }
  }, [user, loading, isAdmin, navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (isAdmin) {
        try {
          const querySnapshot = await getDocs(collection(db, 'users'));
          const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setUsers(usersList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (error) {
          console.error('Erreur:', error);
        } finally {
          setLoadingUsers(false);
        }
      }
    };
    fetchUsers();
  }, [isAdmin]);

  if (loading || loadingUsers) {
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
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Utilisateurs inscrits</h1>
          <p className="text-gray-600">Liste de tous les utilisateurs enregistrés sur la plateforme</p>
        </motion.div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Total : {users.length} utilisateur(s)</h2>
          </div>
          
          {users.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Aucun utilisateur inscrit</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr className="text-left">
                    <th className="py-2">Utilisateur</th>
                    <th className="py-2">Email</th>
                    <th className="py-2">Téléphone</th>
                    <th className="py-2">Ville</th>
                    <th className="py-2">Date d'inscription</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((utilisateur) => (
                    <tr key={utilisateur.id} className="border-b hover:bg-gray-50">
                      <td className="py-2">
                        <div className="flex items-center gap-2">
                          <UserCircleIcon className="w-8 h-8 text-gray-400" />
                          <span className="font-medium">{utilisateur.fullName || 'Non renseigné'}</span>
                        </div>
                       </td>
                      <td className="py-2">{utilisateur.email} </td>
                      <td className="py-2">{utilisateur.phone || '-'} </td>
                      <td className="py-2">{utilisateur.city || '-'} </td>
                      <td className="py-2">
                        {utilisateur.createdAt ? new Date(utilisateur.createdAt).toLocaleDateString('fr-FR') : '-'}
                       </td>
                     </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;