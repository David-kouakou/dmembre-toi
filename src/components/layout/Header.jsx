import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useState, useRef, useEffect } from 'react';
import { UserCircleIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName = user?.email === 'admin@dmembre-toi.com' ? 'Admin' : user?.email?.split('@')[0] || 'Profil';

  return (
    <header className="fixed top-0 w-full bg-white shadow-md py-3 z-50">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          DMEMBRE <span className="text-red-500">TOI</span>
        </Link>
        
        {/* Navigation simplifiée - seulement Accueil et Boutique */}
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-red-500 transition">Accueil</Link>
          <Link to="/shop" className="hover:text-red-500 transition">Boutique</Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative hover:text-red-500 transition">
            <ShoppingBagIcon className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          
          {user ? (
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)} 
                className="flex items-center gap-2 hover:text-red-500 transition"
              >
                <UserCircleIcon className="w-6 h-6" />
                <span className="hidden sm:inline font-medium">
                  {displayName}
                  {isAdmin && <span className="ml-1 text-xs text-red-500">(Admin)</span>}
                </span>
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-50 border">
                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsProfileOpen(false)}>
                    Mon profil
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsProfileOpen(false)}>
                      Dashboard Admin
                    </Link>
                  )}
                  <button onClick={() => { logout(); setIsProfileOpen(false); }} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">
                    Se déconnecter
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="hover:text-red-500 transition">Connexion</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;