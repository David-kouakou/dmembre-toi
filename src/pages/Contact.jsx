import { motion } from 'framer-motion';

const Contact = () => {
  return (
    <div className="pt-32 pb-20 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-black">Contactez-</span>
            <span className="text-red-500">nous</span>
          </h1>
          <div className="w-20 h-1 bg-red-500 mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm"
          >
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Nom complet</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Votre nom"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Email</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="votre@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Message</label>
                <textarea 
                  rows={5} 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Votre message..."
                ></textarea>
              </div>
              
              <button className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition-colors font-semibold">
                Envoyer
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm"
          >
            <h2 className="text-2xl font-bold mb-6">Informations</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Email</h3>
                <p className="text-gray-600">contact@dmembre-toi.com</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Adresse</h3>
                <p className="text-gray-600">📍 Abidjan, Côte d'Ivoire</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Suivez-nous</h3>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-600 hover:text-red-500 transition-colors">Instagram</a>
                  <a href="#" className="text-gray-600 hover:text-red-500 transition-colors">Facebook</a>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100">
              <p className="text-center text-gray-500 text-sm">Réponse sous 24-48h</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;