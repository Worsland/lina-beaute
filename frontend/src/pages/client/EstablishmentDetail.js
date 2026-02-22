import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getEstablishmentById } from '../../redux/slices/establishmentSlice';
import ServiceCard from '../../components/common/ServiceCard';
import ReviewCard from '../../components/common/ReviewCard';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import {
  ArrowBack,
  LocationOn,
  Phone,
  Email,
  AccessTime,
  Star,
  Favorite,
  FavoriteBorder,
  Share,
} from '@mui/icons-material';
import { serviceAPI, reviewAPI } from '../../services/api';
import toast from 'react-hot-toast';

const EstablishmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentEstablishment: establishment, loading } = useSelector(
    (state) => state.establishments
  );

  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewsStats, setReviewsStats] = useState(null);
  const [loadingServices, setLoadingServices] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getEstablishmentById(id));
      fetchServices();
      fetchReviews();
    }
  }, [id, dispatch]);

  const fetchServices = async () => {
    setLoadingServices(true);
    try {
      const response = await serviceAPI.getAll({ establishment: id });
      setServices(response.data.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoadingServices(false);
    }
  };

  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      const response = await reviewAPI.getEstablishment(id, { limit: 10 });
      setReviews(response.data.data);
      setReviewsStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleBook = (service) => {
    // Pour l'instant, juste un toast
    // On implémentera la vraie réservation plus tard
    toast.success(`Service "${service.name}" sélectionné ! 🎉`);
    navigate(`/booking/${id}?service=${service._id}`);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris ❤️');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: establishment?.name,
        text: establishment?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Lien copié dans le presse-papier ! 📋');
    }
  };

  if (loading) {
    return <Loading fullScreen message="Chargement de l'établissement..." />;
  }

  if (!establishment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Établissement non trouvé</h2>
          <Button onClick={() => navigate('/establishments')}>
            Retour à la liste
          </Button>
        </div>
      </div>
    );
  }

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        fontSize="small"
        className={index < Math.floor(rating) ? 'text-yellow-500' : 'text-gray-300'}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec image */}
      <div className="relative h-96 bg-gradient-to-br from-purple-100 to-pink-100">
        {establishment.images && establishment.images[0] ? (
          <img
            src={establishment.images[0]}
            alt={establishment.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-8xl font-bold text-purple-300">
            {establishment.name[0]}{establishment.name.split(' ')[1]?.[0]}
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Bouton retour */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all"
        >
          <ArrowBack />
        </button>

        {/* Actions */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={toggleFavorite}
            className="bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all"
          >
            {isFavorite ? (
              <Favorite className="text-red-500" />
            ) : (
              <FavoriteBorder />
            )}
          </button>
          <button
            onClick={handleShare}
            className="bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all"
          >
            <Share />
          </button>
        </div>

        {/* Titre */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="container mx-auto">
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  {establishment.name}
                </h1>
                <div className="flex items-center space-x-4 text-white">
                  <div className="flex items-center space-x-1">
                    {renderStars(establishment.rating?.average || 0)}
                    <span className="ml-2 font-semibold">
                      {establishment.rating?.average?.toFixed(1) || '0.0'}
                    </span>
                    <span className="text-white/80">
                      ({establishment.rating?.count || 0} avis)
                    </span>
                  </div>
                  <span className="text-white/80">•</span>
                  <span>{establishment.category}</span>
                  <span className="text-white/80">•</span>
                  <span>{establishment.priceRange}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card>
              <h2 className="text-2xl font-bold mb-4">À propos</h2>
              <p className="text-gray-700 leading-relaxed">
                {establishment.description}
              </p>

              {/* Amenities */}
              {establishment.amenities && establishment.amenities.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Équipements</h3>
                  <div className="flex flex-wrap gap-2">
                    {establishment.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Services */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Nos Services</h2>
              {loadingServices ? (
                <Loading message="Chargement des services..." />
              ) : services.length > 0 ? (
                <div className="space-y-4">
                  {services.map((service) => (
                    <ServiceCard
                      key={service._id}
                      service={service}
                      onBook={handleBook}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <p className="text-gray-600 text-center py-8">
                    Aucun service disponible pour le moment
                  </p>
                </Card>
              )}
            </div>

            {/* Avis */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">
                  Avis ({reviewsStats?.total || 0})
                </h2>
                {establishment.rating?.average > 0 && (
                  <div className="flex items-center space-x-2">
                    <div className="flex">{renderStars(establishment.rating.average)}</div>
                    <span className="font-bold text-xl">
                      {establishment.rating.average.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>

              {/* Distribution des notes */}
              {reviewsStats?.ratingDistribution && (
                <Card className="mb-6">
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = reviewsStats.ratingDistribution[rating] || 0;
                      const percentage = reviewsStats.total > 0
                        ? (count / reviewsStats.total) * 100
                        : 0;

                      return (
                        <div key={rating} className="flex items-center space-x-3">
                          <span className="text-sm font-medium w-12">
                            {rating} ⭐
                          </span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-500 h-2 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-12 text-right">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              )}

              {/* Liste des avis */}
              {loadingReviews ? (
                <Loading message="Chargement des avis..." />
              ) : reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <ReviewCard key={review._id} review={review} />
                  ))}
                </div>
              ) : (
                <Card>
                  <p className="text-gray-600 text-center py-8">
                    Aucun avis pour le moment. Soyez le premier à laisser un avis ! ⭐
                  </p>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              {/* Informations de contact */}
              <Card>
                <h3 className="text-lg font-bold mb-4">Informations</h3>

                <div className="space-y-4">
                  {/* Adresse */}
                  <div className="flex items-start space-x-3">
                    <LocationOn className="text-purple-600 mt-1" />
                    <div>
                      <p className="font-medium">Adresse</p>
                      <p className="text-sm text-gray-600">
                        {establishment.address?.street}<br />
                        {establishment.address?.city} {establishment.address?.postalCode}
                      </p>
                    </div>
                  </div>

                  {/* Téléphone */}
                  {establishment.contact?.phone && (
                    <div className="flex items-start space-x-3">
                      <Phone className="text-purple-600 mt-1" />
                      <div>
                        <p className="font-medium">Téléphone</p>
                        <a
                          href={`tel:${establishment.contact.phone}`}
                          className="text-sm text-purple-600 hover:underline"
                        >
                          {establishment.contact.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  {establishment.contact?.email && (
                    <div className="flex items-start space-x-3">
                      <Email className="text-purple-600 mt-1" />
                      <div>
                        <p className="font-medium">Email</p>
                        <a
                          href={`mailto:${establishment.contact.email}`}
                          className="text-sm text-purple-600 hover:underline"
                        >
                          {establishment.contact.email}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Horaires */}
              {establishment.openingHours && establishment.openingHours.length > 0 && (
                <Card>
                  <h3 className="text-lg font-bold mb-4 flex items-center">
                    <AccessTime className="mr-2" />
                    Horaires d'ouverture
                  </h3>

                  <div className="space-y-2">
                    {['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'].map(
                      (day, index) => {
                        const hours = establishment.openingHours.find((h) => h.day === index);
                        return (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="font-medium">{day}</span>
                            <span className="text-gray-600">
                              {hours?.isClosed
                                ? 'Fermé'
                                : `${hours?.open} - ${hours?.close}`}
                            </span>
                          </div>
                        );
                      }
                    )}
                  </div>
                </Card>
              )}

              {/* CTA Réserver */}
              <Button
                fullWidth
                size="lg"
                onClick={() => services.length > 0 && handleBook(services[0])}
              >
                Réserver maintenant
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstablishmentDetail;