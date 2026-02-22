import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEstablishments } from '../../redux/slices/establishmentSlice';
import EstablishmentCard from '../../components/common/EstablishmentCard';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card'; 
import {
  Search,
  FilterList,
  LocationOn,
  Star,
  Euro,
  Category,
} from '@mui/icons-material';
import { SERVICE_CATEGORY_LABELS, PRICE_RANGES, TUNISIAN_CITIES } from '../../utils/constants';

const Establishments = () => {
  const dispatch = useDispatch();
  const { establishments, loading, pagination } = useSelector((state) => state.establishments);

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    city: '',
    priceRange: '',
    minRating: '',
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(getEstablishments(filters));
  }, [dispatch]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    dispatch(getEstablishments(filters));
  };

  const handleReset = () => {
    setFilters({
      search: '',
      category: '',
      city: '',
      priceRange: '',
      minRating: '',
    });
    dispatch(getEstablishments({}));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="gradient-primary py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white text-center mb-6">
            Trouvez votre salon de beauté idéal
          </h1>
          
          {/* Barre de recherche principale */}
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Rechercher un salon, un service..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  icon={<Search fontSize="small" />}
                />
              </div>
              <Button onClick={handleSearch} size="lg">
                Rechercher
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et Résultats */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filtres */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="sticky top-20">
              {/* Bouton filtres mobile */}
              <div className="lg:hidden mb-4">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setShowFilters(!showFilters)}
                  icon={<FilterList fontSize="small" />}
                >
                  Filtres
                </Button>
              </div>

              {/* Filtres */}
              <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                <Card>
                  <h3 className="text-lg font-bold mb-4 flex items-center">
                    <FilterList className="mr-2" />
                    Filtres
                  </h3>

                  {/* Ville */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <LocationOn fontSize="small" className="inline mr-1" />
                      Ville
                    </label>
                    <select
                      value={filters.city}
                      onChange={(e) => handleFilterChange('city', e.target.value)}
                      className="input-field"
                    >
                      <option value="">Toutes les villes</option>
                      {TUNISIAN_CITIES.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Catégorie */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Category fontSize="small" className="inline mr-1" />
                      Catégorie
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="input-field"
                    >
                      <option value="">Toutes les catégories</option>
                      {Object.entries(SERVICE_CATEGORY_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Prix */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Euro fontSize="small" className="inline mr-1" />
                      Gamme de prix
                    </label>
                    <select
                      value={filters.priceRange}
                      onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                      className="input-field"
                    >
                      <option value="">Tous les prix</option>
                      {Object.entries(PRICE_RANGES).map(([key, value]) => (
                        <option key={key} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Note minimale */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Star fontSize="small" className="inline mr-1" />
                      Note minimale
                    </label>
                    <select
                      value={filters.minRating}
                      onChange={(e) => handleFilterChange('minRating', e.target.value)}
                      className="input-field"
                    >
                      <option value="">Toutes les notes</option>
                      <option value="4">4+ étoiles</option>
                      <option value="3">3+ étoiles</option>
                      <option value="2">2+ étoiles</option>
                    </select>
                  </div>

                  {/* Boutons */}
                  <div className="space-y-2">
                    <Button fullWidth onClick={handleSearch}>
                      Appliquer
                    </Button>
                    <Button variant="outline" fullWidth onClick={handleReset}>
                      Réinitialiser
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>

          {/* Liste des établissements */}
          <div className="flex-1">
            {/* En-tête */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {pagination?.total || 0} établissement(s) trouvé(s)
              </h2>

              {/* Tri */}
              <select className="input-field w-auto">
                <option value="rating">Mieux notés</option>
                <option value="distance">Plus proches</option>
                <option value="name">Ordre alphabétique</option>
              </select>
            </div>

            {/* Loading */}
            {loading && <Loading message="Chargement des établissements..." />}

            {/* Liste */}
            {!loading && establishments.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {establishments.map((establishment) => (
                  <EstablishmentCard key={establishment._id} establishment={establishment} />
                ))}
              </div>
            )}

            {/* Aucun résultat */}
            {!loading && establishments.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Aucun établissement trouvé
                </h3>
                <p className="text-gray-600 mb-6">
                  Essayez de modifier vos critères de recherche
                </p>
                <Button onClick={handleReset}>
                  Réinitialiser les filtres
                </Button>
              </div>
            )}

            {/* Pagination (à implémenter plus tard) */}
            {!loading && establishments.length > 0 && pagination?.pages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                <Button variant="outline">Précédent</Button>
                <Button variant="outline">1</Button>
                <Button>2</Button>
                <Button variant="outline">3</Button>
                <Button variant="outline">Suivant</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Establishments;