import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import Modal from './Modal';
import Input from './Input';
import { useDispatch } from 'react-redux';
import { cancelBooking } from '../../redux/slices/bookingSlice';
import {
  CalendarToday,
  AccessTime,
  LocationOn,
  Cancel,
  CheckCircle,
  HourglassEmpty,
  Star,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { BOOKING_STATUS_LABELS } from '../../utils/constants';

const BookingCard = ({ booking, onReviewClick }) => {
  const dispatch = useDispatch();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="text-green-600" />;
      case 'completed':
        return <CheckCircle className="text-blue-600" />;
      case 'pending':
        return <HourglassEmpty className="text-yellow-600" />;
      case 'cancelled':
        return <Cancel className="text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'completed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      return;
    }

    setCancelling(true);
    await dispatch(cancelBooking({ id: booking._id, reason: cancelReason }));
    setCancelling(false);
    setShowCancelModal(false);
  };

  const canCancel = booking.status === 'confirmed' || booking.status === 'pending';
  const canReview = booking.status === 'completed' && !booking.hasReview;

  return (
    <>
      <Card hover>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Image établissement */}
          <div className="w-full md:w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
            {booking.establishment?.images?.[0] ? (
              <img
                src={booking.establishment.images[0]}
                alt={booking.establishment.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-3xl font-bold text-purple-300">
                {booking.establishment?.name?.[0]}
              </div>
            )}
          </div>

          {/* Informations */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {booking.establishment?.name}
                </h3>
                <div className="flex items-center text-sm text-gray-600">
                  <LocationOn fontSize="small" className="mr-1" />
                  {booking.establishment?.address?.city}
                </div>
              </div>

              {/* Badge statut */}
              <div
                className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getStatusColor(
                  booking.status
                )}`}
              >
                {getStatusIcon(booking.status)}
                <span className="text-sm font-semibold">
                  {BOOKING_STATUS_LABELS[booking.status]}
                </span>
              </div>
            </div>

            {/* Services */}
            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-1">Services :</p>
              <div className="flex flex-wrap gap-2">
                {booking.services?.map((item, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm"
                  >
                    {item.service?.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Date et heure */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center">
                <CalendarToday fontSize="small" className="mr-2 text-purple-600" />
                <span>
                  {format(new Date(booking.date), 'EEEE d MMMM yyyy', { locale: fr })}
                </span>
              </div>
              <div className="flex items-center">
                <AccessTime fontSize="small" className="mr-2 text-purple-600" />
                <span>
                  {booking.startTime} - {booking.endTime}
                </span>
              </div>
            </div>

            {/* Prix */}
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-purple-600">
                {booking.totalPrice} DT
              </span>

              {/* Actions */}
              <div className="flex gap-2">
                {canReview && (
                  <Button
                    size="sm"
                    onClick={() => onReviewClick?.(booking)}
                    icon={<Star fontSize="small" />}
                  >
                    Laisser un avis
                  </Button>
                )}

                {canCancel && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCancelModal(true)}
                  >
                    Annuler
                  </Button>
                )}
              </div>
            </div>

            {/* Notes */}
            {booking.notes && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Notes : </span>
                  {booking.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Modal annulation */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Annuler la réservation"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Êtes-vous sûr de vouloir annuler cette réservation ?
          </p>

          <Input
            label="Raison de l'annulation"
            type="textarea"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Veuillez indiquer la raison de l'annulation..."
            rows={3}
            required
          />

          <div className="flex gap-3">
            <Button
              variant="outline"
              fullWidth
              onClick={() => setShowCancelModal(false)}
            >
              Retour
            </Button>
            <Button
              variant="danger"
              fullWidth
              onClick={handleCancel}
              loading={cancelling}
              disabled={!cancelReason.trim()}
            >
              Confirmer l'annulation
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default BookingCard;