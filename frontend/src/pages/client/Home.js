import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Spa, CalendarToday, Star } from '@mui/icons-material';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="gradient-primary py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Réservez votre moment<br />de beauté en ligne
          </h1>
          <p className="text-xl text-white opacity-90 mb-8 max-w-2xl mx-auto">
            Découvrez les meilleurs salons de beauté et spas en Tunisie.
            Réservez en quelques clics avec notre assistant IA.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="shadow-2xl">
                Commencer gratuitement
              </Button>
            </Link>
            <Link to="/establishments">
              <Button variant="secondary" size="lg">
                Découvrir les établissements
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Pourquoi choisir Lina Beauté ?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card hover>
              <div className="text-center">
                <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-white" fontSize="large" />
                </div>
                <h3 className="text-xl font-bold mb-3">Recherche Intelligente</h3>
                <p className="text-gray-600">
                  Notre assistant IA comprend vos besoins et vous recommande les meilleurs établissements.
                </p>
              </div>
            </Card>

            <Card hover>
              <div className="text-center">
                <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarToday className="text-white" fontSize="large" />
                </div>
                <h3 className="text-xl font-bold mb-3">Réservation Facile</h3>
                <p className="text-gray-600">
                  Réservez en quelques clics et recevez une confirmation instantanée par email.
                </p>
              </div>
            </Card>

            <Card hover>
              <div className="text-center">
                <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="text-white" fontSize="large" />
                </div>
                <h3 className="text-xl font-bold mb-3">Avis Vérifiés</h3>
                <p className="text-gray-600">
                  Consultez les avis authentiques de nos utilisateurs pour faire le bon choix.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="gradient-primary text-white text-center p-12">
            <h2 className="text-3xl font-bold mb-4">
              Vous êtes professionnel(le) ?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Rejoignez notre plateforme et développez votre clientèle
            </p>
            <Link to="/register?role=establishment">
              <Button variant="secondary" size="lg">
                Inscrire mon établissement
              </Button>
            </Link>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;