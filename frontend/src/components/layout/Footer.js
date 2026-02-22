import React from 'react';
import { Link } from 'react-router-dom';
import {
  Facebook,
  Instagram,
  Twitter,
  Email,
  Phone,
  LocationOn,
} from '@mui/icons-material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* À propos */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <span className="text-xl font-bold">Lina Beauté</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              La première plateforme tunisienne dédiée à la réservation en ligne de services de beauté et spa.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors"
              >
                <Facebook fontSize="small" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors"
              >
                <Instagram fontSize="small" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors"
              >
                <Twitter fontSize="small" />
              </a>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/establishments" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Établissements
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Pour les professionnels */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Professionnels</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/register?role=establishment" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Inscrire mon établissement
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Centre d'aide
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Conditions générales
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 text-sm">
                <LocationOn className="text-purple-500 mt-0.5" fontSize="small" />
                <span className="text-gray-400">
                  Avenue Habib Bourguiba<br />
                  Tunis, Tunisie
                </span>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <Phone className="text-purple-500" fontSize="small" />
                <a href="tel:+21612345678" className="text-gray-400 hover:text-white transition-colors">
                  +216 12 345 678
                </a>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <Email className="text-purple-500" fontSize="small" />
                <a href="mailto:contact@linabeaute.tn" className="text-gray-400 hover:text-white transition-colors">
                  contact@linabeaute.tn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} Lina Beauté. Tous droits réservés.
          </p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link to="/privacy" className="text-gray-400 hover:text-white text-xs transition-colors">
              Politique de confidentialité
            </Link>
            <span className="text-gray-600">•</span>
            <Link to="/terms" className="text-gray-400 hover:text-white text-xs transition-colors">
              Conditions d'utilisation
            </Link>
            <span className="text-gray-600">•</span>
            <Link to="/cookies" className="text-gray-400 hover:text-white text-xs transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;