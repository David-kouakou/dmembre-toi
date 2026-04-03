import { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  signInWithPopup
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import axios from 'axios';
import { API_URL } from '../lib/api';
import { trackUserLogin, trackUserLogout } from '../lib/userTracking';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        await trackUserLogin(user.uid);
        
        try {
          const token = await user.getIdToken();
          const response = await axios.post(`${API_URL}/auth/verify-token`, { token });
          setIsAdmin(response.data.is_admin);
          console.log('Rôle admin:', response.data.is_admin);
        } catch (error) {
          console.error('Erreur vérification admin:', error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    await trackUserLogin(result.user.uid);
    return result;
  };
  
  const signUp = async (email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await trackUserLogin(result.user.uid);
    return result;
  };
  
  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    await trackUserLogin(result.user.uid);
    return result;
  };
  
  const logout = async () => {
    if (user) {
      await trackUserLogout(user.uid);
    }
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signIn, signUp, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};