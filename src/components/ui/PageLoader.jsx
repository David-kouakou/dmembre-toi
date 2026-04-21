import { motion } from 'framer-motion';

const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4"
        />
        <p className="text-gray-500 text-sm">Chargement...</p>
      </div>
    </div>
  );
};

export default PageLoader;