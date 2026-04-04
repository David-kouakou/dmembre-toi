import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signUp(email, password, fullName);
      toast.success('✅ Inscription réussie !');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      console.error('Erreur inscription:', err);
      let message = 'Erreur lors de l\'inscription';
      if (err.code === 'auth/email-already-in-use') {
        message = 'Cet email est déjà utilisé';
      } else if (err.code === 'auth/weak-password') {
        message = 'Le mot de passe doit contenir au moins 6 caractères';
      } else if (err.code === 'auth/invalid-email') {
        message = 'Email invalide';
      }
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 min-h-screen flex items-center justify-center bg-gray-50">
      <Toaster position="top-center" />
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Inscription</h1>
        {error && <p className="text-red-500 text-center mb-4 text-sm">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Nom complet" 
            value={fullName} 
            onChange={(e) => setFullName(e.target.value)} 
            className="w-full px-4 py-2 border rounded-lg mb-4" 
            required 
          />
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full px-4 py-2 border rounded-lg mb-4" 
            required 
          />
          <input 
            type="password" 
            placeholder="Mot de passe (min 6 caractères)" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full px-4 py-2 border rounded-lg mb-6" 
            required 
          />
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? 'Chargement...' : "S'inscrire"}
          </button>
        </form>
        <p className="text-center text-gray-500 mt-4">
          Déjà un compte ? <Link to="/login" className="text-red-500">Se connecter</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;