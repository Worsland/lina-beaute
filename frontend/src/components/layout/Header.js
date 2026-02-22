import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  AccountCircle,
  ExitToApp,
  Dashboard,
  CalendarToday,
  Favorite,
} from '@mui/icons-material';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setProfileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <span className="text-xl font-bold gradient-primary bg-clip-text text-transparent">
              Lina Beauté
            </span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
              Accueil
            </Link>
            <Link to="/establishments" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
              Établissements
            </Link>
            <Link to="/services" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
              Services
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
              À propos
            </Link>
          </nav>

          {/* Actions Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link to="/login">
                  <button className="px-6 py-2 text-purple-600 font-semibold hover:text-purple-700 transition-colors">
                    Connexion
                  </button>
                </Link>
                <Link to="/register">
                  <button className="btn-primary">
                    Inscription
                  </button>
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-semibold">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                  <span className="font-medium">{user?.firstName}</span>
                </button>

                {/* Dropdown Menu */}
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>

                    {user?.role === 'establishment_admin' && (
                      <Link
                        to="/dashboard"
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <Dashboard className="text-gray-600" fontSize="small" />
                        <span className="text-sm text-gray-700">Dashboard</span>
                      </Link>
                    )}

                    <Link
                      to="/profile"
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      <AccountCircle className="text-gray-600" fontSize="small" />
                      <span className="text-sm text-gray-700">Mon Profil</span>
                    </Link>

                    <Link
                      to="/bookings"
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      <CalendarToday className="text-gray-600" fontSize="small" />
                      <span className="text-sm text-gray-700">Mes Réservations</span>
                    </Link>

                    <Link
                      to="/favorites"
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      <Favorite className="text-gray-600" fontSize="small" />
                      <span className="text-sm text-gray-700">Mes Favoris</span>
                    </Link>

                    <div className="border-t border-gray-100 mt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors w-full text-left"
                      >
                        <ExitToApp className="text-red-600" fontSize="small" />
                        <span className="text-sm text-red-600">Déconnexion</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Menu Mobile Button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link
                to="/establishments"
                className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Établissements
              </Link>
              <Link
                to="/services"
                className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Services
              </Link>
              
              {!isAuthenticated ? (
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-100">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <button className="w-full px-6 py-2 text-purple-600 font-semibold border-2 border-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
                      Connexion
                    </button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <button className="w-full btn-primary">
                      Inscription
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 text-red-600 font-medium"
                  >
                    <ExitToApp fontSize="small" />
                    <span>Déconnexion</span>
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;