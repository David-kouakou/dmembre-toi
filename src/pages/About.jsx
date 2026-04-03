import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="pt-32 pb-20 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-black">À propos de</span>
            <span className="text-red-500"> DMEMBRE TOI</span>
          </h1>
          <div className="w-20 h-1 bg-red-500 mx-auto rounded-full"></div>
        </motion.div>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-50 rounded-2xl p-8"
          >
            <p className="text-lg text-gray-700 leading-relaxed">
              DMEMBRE TOI est une marque de street wear ivoirienne qui célèbre l'authenticité 
              et l'expression de soi. Chaque pièce est conçue avec passion et attention aux détails, 
              pour ceux qui osent être eux-mêmes.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-50 rounded-2xl p-8"
            >
              <h2 className="text-xl font-bold mb-3">On connaît la chaleur</h2>
              <p className="text-gray-600">
                Chez DMEMBRE TOI, on sait qu'à Abidjan, il fait chaud. C'est pourquoi 
                <span className="font-semibold text-red-500"> on a choisi le sans manches</span>. 
                Pour être stylé sans avoir chaud.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-50 rounded-2xl p-8"
            >
              <h2 className="text-xl font-bold mb-3">HOLY SAINT LOVE</h2>
              <p className="text-gray-600">
                Inspiré par le style HOLY SAINT LOVE, chaque pièce est unique. 
                Des débardeurs aux hoodies sans manches, en passant par les vestes en jean revisitées.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-red-500 rounded-2xl p-8 text-white text-center"
          >
            <p className="text-xl italic">
              "Reste frais. Reste stylé. Reste toi-même."
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;