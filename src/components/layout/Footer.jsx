import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">DMEMBRE TOI</h3>
            <p className="text-gray-400">Street wear authentique pour ceux qui osent être eux-mêmes</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Liens rapides</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/shop" className="hover:text-white">Boutique</Link></li>
              <li><Link to="/about" className="hover:text-white">À propos</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-gray-400">Email: contact@dmembre-toi.com</p>
            <p className="text-gray-400">📍 Abidjan, Côte d'Ivoire</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <form className="flex flex-col gap-2">
              <input type="email" placeholder="Votre email" className="px-4 py-2 rounded-lg text-black" />
              <button className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600">S'inscrire</button>
            </form>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500">
          <p>&copy; 2026 DMEMBRE TOI. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;