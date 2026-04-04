import { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import axios from 'axios';
import { API_URL } from '../lib/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  // Charger tous les utilisateurs (admin uniquement)
  const fetchAllUsers = async () => {
    if (isAdmin) {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllUsers(users);
      } catch (error) {
        console.error('Erreur chargement utilisateurs:', error);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Charger le profil utilisateur depuis Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
        } else {
          // Créer un profil par défaut
          const defaultProfile = {
            fullName: user.displayName || '',
            email: user.email,
            phone: '',
            city: '',
            neighborhood: '',
            country: "Côte d'Ivoire",
            createdAt: new Date().toISOString()
          };
          await setDoc(doc(db, 'users', user.uid), defaultProfile);
          setUserProfile(defaultProfile);
        }
        
        try {
          const token = await user.getIdToken();
          const response = await axios.post(`${API_URL}/auth/verify-token`, { token });
          setIsAdmin(response.data.is_admin);
          if (response.data.is_admin) {
            fetchAllUsers();
          }
        } catch (error) {
          console.error('Erreur vérification admin:', error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
        setUserProfile(null);
      }
      
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = (email, password) => signInWithEmailAndPassword(auth, email, password);
  
  const signUp = async (email, password, fullName) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: fullName });
    
    // Créer le profil dans Firestore
    await setDoc(doc(db, 'users', result.user.uid), {
      fullName: fullName,
      email: email,
      phone: '',
      city: '',
      neighborhood: '',
      country: "Côte d'Ivoire",
      createdAt: new Date().toISOString()
    });
    
    return result;
  };
  
  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', result.user.uid), {
        fullName: result.user.displayName || '',
        email: result.user.email,
        phone: '',
        city: '',
        neighborhood: '',
        country: "Côte d'Ivoire",
        createdAt: new Date().toISOString()
      });
    }
    return result;
  };
  
  const updateUserProfile = async (data) => {
    if (user) {
      await setDoc(doc(db, 'users', user.uid), data, { merge: true });
      setUserProfile({ ...userProfile, ...data });
    }
  };
  
  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isAdmin, 
      userProfile,
      allUsers,
      signIn, 
      signUp, 
      signInWithGoogle, 
      logout,
      updateUserProfile,
      fetchAllUsers
    }}>
      {children}
    </AuthContext.Provider>
  );
};