import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const Home = () => {
  const images = [
    '/images/hero-bg-1.jpg',
    '/images/hero-bg-2.jpg'
  ];
  
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const categories = [
    { name: 'Sans Manches', description: 'Débardeurs et tanks', color: 'bg-gray-900' },
    { name: 'Hoodies Sans Manches', description: 'Sweats à capuche sans manches', color: 'bg-gray-800' },
    { name: 'Vestes Jean Sans Manches', description: 'Denim vestes uniques', color: 'bg-gray-700' }
  ];

  return (
    <div>
      {/* Hero Section avec carrousel */}
      <div 
        className="min-h-screen bg-cover bg-center bg-no-repeat relative transition-all duration-1000"
        style={{ backgroundImage: `url('${images[currentImage]}')` }}
      >
        <div className="absolute inset-0 bg-black/40" />
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
            <Link to="/shop" className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all inline-block">
              Découvrir
            </Link>
          </motion.div>
          
          {/* Indicateurs */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`w-2 h-2 rounded-full transition-all ${currentImage === index ? 'w-6 bg-red-500' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Section Catégories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nos pièces</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Des vêtements pensés pour le climat ivoirien, sans manches pour rester frais
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <Link to="/shop">
                  <div className={`relative h-80 rounded-2xl overflow-hidden ${category.color} transition-all group-hover:scale-105 duration-300`}>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                      <p className="text-gray-300 text-sm">{category.description}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Confort */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Pensé pour toi, <br />
                <span className="text-red-500">sous le soleil ivoirien</span>
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Chez DMEMBRE TOI, on a choisi le <span className="font-semibold">sans manches</span>. 
                Parce qu'à Abidjan, on veut être stylé sans avoir chaud.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Des débardeurs aux hoodies sans manches, en passant par les vestes en jean revisitées, 
                chaque pièce est pensée pour te garder frais tout en imposant ton style.
              </p>
              <Link to="/shop">
                <button className="border-2 border-black text-black px-8 py-3 rounded-full hover:bg-black hover:text-white transition-all">
                  Voir la collection
                </button>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gray-200 rounded-2xl h-96 flex items-center justify-center"
            >
              <div className="text-center">
                <p className="text-gray-500 text-lg font-semibold">HOLY SAINT LOVE</p>
                <p className="text-gray-400 text-sm">Style sans manches</p>
              </div>
            </motion.div>
          </div>
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