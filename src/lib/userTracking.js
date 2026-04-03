import { db } from './firebase';
import { doc, setDoc, updateDoc, increment, onSnapshot } from 'firebase/firestore';

// Appeler cette fonction quand l'utilisateur se connecte
export const trackUserLogin = async (userId) => {
  try {
    const userRef = doc(db, 'activeUsers', userId);
    await setDoc(userRef, {
      userId: userId,
      lastSeen: new Date().toISOString(),
      status: 'online'
    });
    
    // Incrémenter le compteur total
    const statsRef = doc(db, 'stats', 'activeCount');
    await setDoc(statsRef, { count: increment(1) }, { merge: true });
  } catch (error) {
    console.error('Erreur tracking:', error);
  }
};

// Appeler cette fonction quand l'utilisateur se déconnecte
export const trackUserLogout = async (userId) => {
  try {
    const userRef = doc(db, 'activeUsers', userId);
    await setDoc(userRef, { status: 'offline', lastSeen: new Date().toISOString() });
    
    // Décrémenter le compteur total
    const statsRef = doc(db, 'stats', 'activeCount');
    await setDoc(statsRef, { count: increment(-1) }, { merge: true });
  } catch (error) {
    console.error('Erreur tracking:', error);
  }
};

// Écouter les changements du compteur
export const listenActiveUsersCount = (callback) => {
  const statsRef = doc(db, 'stats', 'activeCount');
  return onSnapshot(statsRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data().count || 0);
    } else {
      callback(0);
    }
  });
};