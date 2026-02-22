import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMyBookings } from '../../redux/slices/bookingSlice';
import BookingCard from '../../components/common/BookingCard';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import {
  CalendarToday,
  CheckCircle,
  HourglassEmpty,
  Cancel,
} from '@mui/icons-material';

const MyBookings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { bookings, loading } = useSelector((state) => state.bookings);

  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    dispatch(getMyBookings());
  }, [isAuthenticated, dispatch, navigate]);

  const filterBookings = () => {
    switch (filter) {
      case 'upcoming':
        return bookings.filter(
          (b) =>
            (b.status === 'confirmed' || b.status === 'pending') &&
            new Date(b.date) >= new Date()
        );
      case 'completed':
        return bookings.filter((b) => b.status === 'completed');
      case 'cancelled':
        return bookings.filter((b) => b.status === 'cancelled');
      default:
        return bookings;
    }
  };

  const filteredBookings = filterBookings();

  const getStats = () => {
    return {
      total: bookings.length,
      upcoming: bookings.filter(
        (b) =>
          (b.status === 'confirmed' || b.status === 'pending') &&
          new Date(b.date) >= new Date()
      ).length,
      completed: bookings.filter((b) => b.status === 'completed').length,
      cancelled: bookings.filter((b) => b.status === 'cancelled').length,
    };
  };

  const stats = getStats();

  const handleReviewClick = (booking) => {
    // Rediriger vers une page d'avis (à implémenter)
    navigate(`/review/${booking._id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="gradient-primary py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white text-center mb-2">
            Mes Réservations
          </h1>
          <p className="text-white/80 text-center">
            Gérez toutes vos réservations en un seul endroit
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card hover onClick={() => setFilter('all')} className="cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <CalendarToday className="text-purple-600" fontSize="large" />
            </div>
          </Card>

          <Card hover onClick={() => setFilter('upcoming')} className="cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">À venir</p>
                <p className="text-3xl font-bold text-blue-600">{stats.upcoming}</p>
              </div>
              <HourglassEmpty className="text-blue-600" fontSize="large" />
            </div>
          </Card>

          <Card hover onClick={() => setFilter('completed')} className="cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Terminées</p>
                <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="text-green-600" fontSize="large" />
            </div>
          </Card>

          <Card hover onClick={() => setFilter('cancelled')} className="cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Annulées</p>
                <p className="text-3xl font-bold text-red-600">{stats.cancelled}</p>
              </div>
              <Cancel className="text-red-600" fontSize="large" />
            </div>
          </Card>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={filter === 'all' ? 'primary' : 'outline'}
            onClick={() => setFilter('all')}
          >
            Toutes
          </Button>
          <Button
            variant={filter === 'upcoming' ? 'primary' : 'outline'}
            onClick={() => setFilter('upcoming')}
          >
            À venir
          </Button>
          <Button
            variant={filter === 'completed' ? 'primary' : 'outline'}
            onClick={() => setFilter('completed')}
          >
            Terminées
          </Button>
          <Button
            variant={filter === 'cancelled' ? 'primary' : 'outline'}
            onClick={() => setFilter('cancelled')}
          >
            Annulées
          </Button>
        </div>

        {/* Liste des réservations */}
        {loading ? (
          <Loading message="Chargement de vos réservations..." />
        ) : filteredBookings.length > 0 ? (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onReviewClick={handleReviewClick}
              />
            ))}
          </div>
        ) : (
          <Card>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {filter === 'all'
                  ? 'Aucune réservation'
                  : `Aucune réservation ${
                      filter === 'upcoming'
                        ? 'à venir'
                        : filter === 'completed'
                        ? 'terminée'
                        : 'annulée'
                    }`}
              </h3>
              <p className="text-gray-600 mb-6">
                Commencez à réserver vos services préférés dès maintenant
              </p>
              <Button onClick={() => navigate('/establishments')}>
                Découvrir les établissements
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MyBookings;