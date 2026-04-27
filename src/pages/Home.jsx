import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div>
      {/* Hero Section avec image de fond */}
      <div 
        className="min-h-screen bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: "url('/images/hero-bg.png')" }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center text-white px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-4"
          >
            DMEMBRE <span className="text-red-500">TOI</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl mb-8 max-w-2xl"
          >
            Street wear authentique pour ceux qui osent être eux-mêmes
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link to="/shop">
              <button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all">
                Découvrir
              </button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Section "Collection bientôt disponible" */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Nouvelle Collection
            </h2>
            <div className="w-24 h-1 bg-red-500 mx-auto mb-8"></div>
            <p className="text-xl md:text-2xl text-gray-600 mb-4">
              🔜 Bientôt disponible
            </p>
            <p className="text-gray-500 max-w-lg mx-auto">
              Préparez-vous à découvrir nos nouvelles pièces. Une collection unique arrive très prochainement.
            </p>
            <div className="mt-8">
              <div className="inline-flex items-center gap-2 text-gray-400">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                <span className="text-sm">Inscrivez-vous à la newsletter pour être informé</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Rejoins la communauté</h2>
          <p className="text-lg mb-8 max-w-lg mx-auto">
            Inscris-toi pour recevoir -10% sur ta première commande
          </p>
          <form className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
            <input type="email" placeholder="Ton email" className="flex-1 px-6 py-3 rounded-lg text-black" />
            <button className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-lg transition-colors">
              S'inscrire
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;