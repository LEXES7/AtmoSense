import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  WbSunny, 
  Brightness2,
  Menu as MenuIcon, 
  Close as CloseIcon,
  Map as MapIcon
} from '@mui/icons-material';

const Header = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    localStorage.setItem('darkMode', newDarkMode);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/90 dark:bg-gray-900/90 shadow-md backdrop-blur-sm' : 
      'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <WbSunny className="h-8 w-8 text-yellow-500" />
              <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">
                AtmoSense
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`transition-colors duration-200 ${
                isActiveLink('/') 
                  ? 'text-blue-600 dark:text-blue-400 font-medium' 
                  : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
              }`}
            >
              Home
            </Link>
          
            <Link 
              to="/weather-maps" 
              className={`flex items-center transition-colors duration-200 ${
                isActiveLink('/weather-maps') 
                  ? 'text-blue-600 dark:text-blue-400 font-medium' 
                  : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
              }`}
            >
              <MapIcon className="mr-1" fontSize="small" />
              Weather Maps
            </Link>
            <Link 
              to="/about" 
              className={`transition-colors duration-200 ${
                isActiveLink('/about') 
                  ? 'text-blue-600 dark:text-blue-400 font-medium' 
                  : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
              }`}
            >
              About
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors duration-200"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <WbSunny className="text-yellow-500" />
              ) : (
                <Brightness2 className="text-gray-700" />
              )}
            </button>
          </div>

          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 focus:outline-none transition-colors duration-200"
            >
              {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      <div className={`md:hidden transition-all duration-300 ${
        isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
      } bg-white dark:bg-gray-900 shadow-lg`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link 
            to="/" 
            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
              isActiveLink('/') 
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
                : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
        
          <Link 
            to="/weather-maps" 
            className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
              isActiveLink('/weather-maps') 
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
                : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            <MapIcon className="mr-2" fontSize="small" />
            Weather Maps
          </Link>
          <Link 
            to="/about" 
            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
              isActiveLink('/about') 
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
                : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          
          <div className="flex items-center justify-between px-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button 
              onClick={toggleDarkMode} 
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              {darkMode ? (
                <>
                  <WbSunny className="mr-3 text-yellow-500" /> 
                  Light Mode
                </>
              ) : (
                <>
                  <Brightness2 className="mr-3" /> 
                  Dark Mode
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;