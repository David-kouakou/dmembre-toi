// Cache simple pour les produits
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export const cache = {
  set(key, data) {
    try {
      const item = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(key, JSON.stringify(item));
    } catch (e) {
      console.error('Cache error:', e);
    }
  },
  
  get(key) {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      const { data, timestamp } = JSON.parse(item);
      if (Date.now() - timestamp > CACHE_DURATION) {
        localStorage.removeItem(key);
        return null;
      }
      return data;
    } catch (e) {
      return null;
    }
  },
  
  clear(key) {
    if (key) {
      localStorage.removeItem(key);
    } else {
      localStorage.clear();
    }
  }
};