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
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
          } else {
            const defaultProfile = {
              fullName: firebaseUser.displayName || '',
              email: firebaseUser.email,
              phone: '',
              city: '',
              neighborhood: '',
              country: "Côte d'Ivoire",
              createdAt: new Date().toISOString()
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), defaultProfile);
            setUserProfile(defaultProfile);
          }
        } catch (error) {
          console.error('Erreur chargement profil:', error);
        }
        
        // Vérifier si admin (par email)
        setIsAdmin(firebaseUser.email === 'admin@dmembre-toi.com');
      } else {
        setIsAdmin(false);
        setUserProfile(null);
      }
      
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };
  
  const signUp = async (email, password, fullName) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: fullName });
    
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
      signIn, 
      signUp, 
      signInWithGoogle, 
      logout,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};