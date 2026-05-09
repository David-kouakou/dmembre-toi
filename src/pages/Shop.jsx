import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Shop = () => {
  return (
    <div className="pt-32 min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🎨</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Collection à venir</h1>
          <div className="w-24 h-1 bg-red-500 mx-auto mb-8"></div>
          <p className="text-xl md:text-2xl text-gray-600 mb-6">🔜 Bientôt disponible</p>
          <p className="text-gray-500 max-w-lg mx-auto mb-8">
            Notre collection est en préparation. Revenez bientôt pour découvrir nos créations.
          </p>
          <Link to="/">
            <button className="border-2 border-black text-black px-8 py-3 rounded-full hover:bg-black hover:text-white transition-all">
              Retour à l'accueil
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Shop;