import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useState, useRef, useEffect } from 'react';
import { UserCircleIcon, ShoppingBagIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const profileRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const displayName = user?.email === 'admin@dmembre-toi.com' ? 'Admin' : user?.email?.split('@')[0] || 'Profil';

  return (
    <>
      <header className="fixed top-0 w-full bg-white shadow-md py-3 z-50">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            DMEMBRE <span className="text-red-500">TOI</span>
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-red-500 transition">Accueil</Link>
            <Link to="/shop" className="hover:text-red-500 transition">Boutique</Link>
            <Link to="/about" className="hover:text-red-500 transition">À propos</Link>
            <Link to="/contact" className="hover:text-red-500 transition">Contact</Link>
          </nav>
          
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSearchOpen(true)} className="hover:text-red-500 transition">
              <MagnifyingGlassIcon className="w-6 h-6" />
            </button>

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
                    <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsProfileOpen(false)}>
                      Mes commandes
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsProfileOpen(false)}>
                        Dashboard Admin
                      </Link>
                    )}
                    {isAdmin && (
                      <Link to="/admin/users" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsProfileOpen(false)}>
                        Utilisateurs
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

      {/* Modal de recherche */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-md flex items-start justify-center pt-24 px-4">
          <div className="w-full max-w-2xl">
            <div className="flex justify-end mb-4">
              <button onClick={() => setIsSearchOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSearch}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un produit..."
                className="w-full bg-transparent border-b-2 border-gray-200 focus:border-red-500 text-gray-800 text-2xl sm:text-3xl py-4 outline-none transition-colors placeholder:text-gray-400"
                autoFocus
              />
              <button type="submit" className="mt-6 bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full transition-colors">
                Rechercher
              </button>
            </form>
            <p className="text-gray-400 text-sm mt-4">
              Recherche par nom, description ou catégorie
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;