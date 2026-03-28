import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, MessageSquare, Search, LayoutDashboard, Menu, X, LogIn, LogOut, Globe } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import logo from '../assets/logo1.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { currentLanguage, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    // Keep visible at all times as requested to avoid 'overwriting' / jumping issues
    setIsVisible(true);
  }, []);

  const navLinks = [
    { name: t('nav_home'), path: '/', icon: Shield },
    { name: t('nav_chat'), path: '/chat', icon: MessageSquare },
    { name: t('nav_schemes'), path: '/schemes', icon: Search },
    { name: t('nav_detector'), path: '/detector', icon: Shield },
    { name: t('nav_dashboard'), path: '/dashboard', icon: LayoutDashboard },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.nav 
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 w-full z-50 glass-nav"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative w-10 h-10 flex items-center justify-center overflow-hidden">
                <img 
                  src={logo} 
                  alt="Sudarshan Grid Logo" 
                  className="w-full h-full object-contain filter invert-[.85] brightness-125 transition-all"
                  style={{ mixBlendMode: 'screen' }}
                />
              </div>
              <span className="text-xl font-bold tracking-tight text-white uppercase ml-1">{t('brand_name')}</span>
            </Link>
          </div>

          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center space-x-2 ${isActive(link.path)
                      ? 'bg-primary/10 text-primary border border-primary/30'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <link.icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-bold bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-primary/50 transition-all uppercase"
            >
              <Globe className="w-4 h-4 text-primary" />
              <span>{currentLanguage === 'en' ? 'EN' : 'हि'}</span>
            </button>

            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium text-red-400 hover:text-white hover:bg-red-500/20 transition-all border border-red-500/30"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('nav_logout')}</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium text-primary hover:text-white hover:bg-primary/20 transition-all border border-primary/30"
              >
                <LogIn className="w-4 h-4" />
                <span>{t('nav_login')}</span>
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/5 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-nav absolute w-full overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${isActive(link.path)
                      ? 'bg-primary/10 text-primary border border-primary/30'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <div className="flex items-center space-x-3">
                    <link.icon className="w-5 h-5" />
                    <span>{link.name}</span>
                  </div>
                </Link>
              ))}
              <div className="pt-4 pb-2 border-t border-white/10 mt-2 space-y-2">
                {/* Mobile Language Switcher */}
                <button
                  onClick={toggleLanguage}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5"
                >
                  <Globe className="w-5 h-5 text-primary" />
                  <span>{currentLanguage === 'en' ? 'English (EN)' : 'हिंदी (HI)'}</span>
                </button>

                {user ? (
                  <button
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-red-400 hover:text-white hover:bg-red-500/20"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>{t('nav_logout')}</span>
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-primary hover:text-white hover:bg-primary/20"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>{t('nav_login')} / {t('nav_register')}</span>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
