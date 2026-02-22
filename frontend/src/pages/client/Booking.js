import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createBooking } from '../../redux/slices/bookingSlice';
import { getEstablishmentById } from '../../redux/slices/establishmentSlice';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loading from '../../components/common/Loading';
import { serviceAPI, bookingAPI } from '../../services/api';
import {
  CalendarToday,
  AccessTime,
  Person,
  Notes,
  CheckCircle,
  ArrowBack,
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import { format, addDays, parse } from 'date-fns';
import { fr } from 'date-fns/locale';

const Booking = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentEstablishment: establishment } = useSelector((state) => state.establishments);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { loading: bookingLoading } = useSelector((state) => state.bookings);

  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [notes, setNotes] = useState('');
  const [step, setStep] = useState(1);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Vous devez être connecté pour réserver');
      navigate('/login');
      return;
    }

    if (id) {
      dispatch(getEstablishmentById(id));
      fetchServices();
    }
  }, [id, isAuthenticated, dispatch, navigate]);

  useEffect(() => {
    const serviceId = searchParams.get('service');
    if (serviceId && services.length > 0) {
      const service = services.find((s) => s._id === serviceId);
      if (service) {
        setSelectedServices([service]);
      }
    }
  }, [searchParams, services]);

  const fetchServices = async () => {
    try {
      const response = await serviceAPI.getAll({ establishment: id });
      setServices(response.data.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleServiceToggle = (service) => {
    setSelectedServices((prev) => {
      const exists = prev.find((s) => s._id === service._id);
      if (exists) {
        return prev.filter((s) => s._id !== service._id);
      } else {
        return [...prev, service];
      }
    });
  };

  const handleDateChange = async (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    await fetchAvailableSlots(date);
  };

  const fetchAvailableSlots = async (date) => {
    setLoadingSlots(true);
    try {
      // Générer des créneaux horaires (en attendant l'API réelle)
      const slots = generateTimeSlots();
      setAvailableSlots(slots);
    } catch (error) {
      console.error('Error fetching slots:', error);
      toast.error('Erreur lors du chargement des créneaux');
    } finally {
      setLoadingSlots(false);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push({
          time,
          available: Math.random() > 0.3, // Simuler disponibilité
        });
      }
    }
    return slots;
  };

  const calculateTotalPrice = () => {
    return selectedServices.reduce((sum, service) => sum + service.price, 0);
  };

  const calculateTotalDuration = () => {
    return selectedServices.reduce((sum, service) => sum + service.duration, 0);
  };

  const handleSubmit = async () => {
    if (selectedServices.length === 0) {
      toast.error('Veuillez sélectionner au moins un service');
      return;
    }

    if (!selectedDate) {
      toast.error('Veuillez sélectionner une date');
      return;
    }

    if (!selectedSlot) {
      toast.error('Veuillez sélectionner un créneau horaire');
      return;
    }

    const totalDuration = calculateTotalDuration();
    const [startHour, startMinute] = selectedSlot.time.split(':').map(Number);
    const endHour = Math.floor((startHour * 60 + startMinute + totalDuration) / 60);
    const endMinute = (startHour * 60 + startMinute + totalDuration) % 60;
    const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;

    const bookingData = {
      establishment: id,
      services: selectedServices.map((s) => ({ service: s._id })),
      date: selectedDate,
      startTime: selectedSlot.time,
      endTime: endTime,
      notes: notes.trim() || undefined,
    };

    const result = await dispatch(createBooking(bookingData));

    if (!result.error) {
      setStep(4); // Confirmation
    }
  };

  const getNextSevenDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = addDays(new Date(), i);
      days.push({
        date: format(date, 'yyyy-MM-dd'),
        label: format(date, 'EEE d MMM', { locale: fr }),
        isToday: i === 0,
      });
    }
    return days;
  };

  if (!establishment) {
    return <Loading fullScreen message="Chargement..." />;
  }

  // Étape 4 : Confirmation
  if (step === 4) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <Card className="text-center p-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-green-600" style={{ fontSize: 48 }} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Réservation confirmée ! 🎉
            </h1>
            <p className="text-gray-600 mb-8">
              Votre réservation chez <strong>{establishment.name}</strong> a été confirmée.
              <br />
              Vous recevrez un email de confirmation dans quelques instants.
            </p>

            <div className="bg-purple-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-bold mb-4">Récapitulatif</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Date :</strong> {format(new Date(selectedDate), 'EEEE d MMMM yyyy', { locale: fr })}
                </p>
                <p>
                  <strong>Heure :</strong> {selectedSlot?.time}
                </p>
                <p>
                  <strong>Services :</strong> {selectedServices.map((s) => s.name).join(', ')}
                </p>
                <p>
                  <strong>Durée totale :</strong> {calculateTotalDuration()} min
                </p>
                <p>
                  <strong>Prix total :</strong> {calculateTotalPrice()} DT
                </p>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate('/bookings')}>
                Voir mes réservations
              </Button>
              <Button variant="outline" onClick={() => navigate('/')}>
                Retour à l'accueil
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowBack className="mr-2" />
          Retour
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Réserver chez {establishment.name}</h1>
          <p className="text-gray-600">{establishment.address?.city}</p>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-center mb-8">
          {[
            { num: 1, label: 'Services' },
            { num: 2, label: 'Date & Heure' },
            { num: 3, label: 'Confirmation' },
          ].map((s, index) => (
            <React.Fragment key={s.num}>
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= s.num
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {s.num}
                </div>
                <span
                  className={`ml-2 font-medium ${
                    step >= s.num ? 'text-purple-600' : 'text-gray-500'
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {index < 2 && (
                <div
                  className={`h-1 w-24 mx-4 ${
                    step > s.num ? 'bg-purple-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2">
            {/* Étape 1 : Sélection des services */}
            {step === 1 && (
              <Card>
                <h2 className="text-2xl font-bold mb-6">Choisissez vos services</h2>
                {services.length > 0 ? (
                  <div className="space-y-4">
                    {services.map((service) => {
                      const isSelected = selectedServices.find((s) => s._id === service._id);
                      return (
                        <div
                          key={service._id}
                          onClick={() => handleServiceToggle(service)}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            isSelected
                              ? 'border-purple-600 bg-purple-50'
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <input
                                  type="checkbox"
                                  checked={!!isSelected}
                                  onChange={() => {}}
                                  className="w-5 h-5 text-purple-600"
                                />
                                <h3 className="font-bold text-lg">{service.name}</h3>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span className="flex items-center">
                                  <AccessTime fontSize="small" className="mr-1" />
                                  {service.duration} min
                                </span>
                                <span className="text-lg font-bold text-purple-600">
                                  {service.price} DT
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center text-gray-600 py-8">Aucun service disponible</p>
                )}

                <div className="mt-6">
                  <Button
                    fullWidth
                    onClick={() => setStep(2)}
                    disabled={selectedServices.length === 0}
                  >
                    Continuer
                  </Button>
                </div>
              </Card>
            )}

            {/* Étape 2 : Date et heure */}
            {step === 2 && (
              <div className="space-y-6">
                <Card>
                  <h2 className="text-2xl font-bold mb-6">Choisissez une date</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {getNextSevenDays().map((day) => (
                      <button
                        key={day.date}
                        onClick={() => handleDateChange(day.date)}
                        className={`p-4 border-2 rounded-lg text-center transition-all ${
                          selectedDate === day.date
                            ? 'border-purple-600 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <p className="text-sm text-gray-600">{day.label.split(' ')[0]}</p>
                        <p className="text-2xl font-bold mt-1">
                          {day.label.split(' ')[1]}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {day.label.split(' ')[2]}
                        </p>
                      </button>
                    ))}
                  </div>
                </Card>

                {selectedDate && (
                  <Card>
                    <h2 className="text-2xl font-bold mb-6">Choisissez un créneau</h2>
                    {loadingSlots ? (
                      <Loading message="Chargement des créneaux..." />
                    ) : (
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                        {availableSlots.map((slot) => (
                          <button
                            key={slot.time}
                            onClick={() => slot.available && setSelectedSlot(slot)}
                            disabled={!slot.available}
                            className={`p-3 border-2 rounded-lg text-center transition-all ${
                              selectedSlot?.time === slot.time
                                ? 'border-purple-600 bg-purple-50 font-bold'
                                : slot.available
                                ? 'border-gray-200 hover:border-purple-300'
                                : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                    )}
                  </Card>
                )}

                <Card>
                  <h3 className="font-bold mb-3">Notes (optionnel)</h3>
                  <Input
                    type="textarea"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ajoutez des notes pour l'établissement (préférences, allergies, etc.)"
                    rows={4}
                  />
                </Card>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Retour
                  </Button>
                  <Button
                    fullWidth
                    onClick={() => setStep(3)}
                    disabled={!selectedDate || !selectedSlot}
                  >
                    Continuer
                  </Button>
                </div>
              </div>
            )}

            {/* Étape 3 : Confirmation */}
            {step === 3 && (
              <Card>
                <h2 className="text-2xl font-bold mb-6">Confirmez votre réservation</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Établissement</h3>
                    <p className="text-gray-700">{establishment.name}</p>
                    <p className="text-sm text-gray-600">{establishment.address?.street}, {establishment.address?.city}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Services sélectionnés</h3>
                    <ul className="space-y-2">
                      {selectedServices.map((service) => (
                        <li key={service._id} className="flex justify-between">
                          <span>{service.name}</span>
                          <span className="font-semibold">{service.price} DT</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Date et heure</h3>
                    <p className="text-gray-700">
                      {format(new Date(selectedDate), 'EEEE d MMMM yyyy', { locale: fr })}
                    </p>
                    <p className="text-gray-700">À {selectedSlot?.time}</p>
                    <p className="text-sm text-gray-600">Durée : {calculateTotalDuration()} minutes</p>
                  </div>

                  {notes && (
                    <div>
                      <h3 className="font-semibold mb-3">Notes</h3>
                      <p className="text-gray-700">{notes}</p>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="text-purple-600">{calculateTotalPrice()} DT</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    Retour
                  </Button>
                  <Button fullWidth onClick={handleSubmit} loading={bookingLoading}>
                    Confirmer la réservation
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar récapitulatif */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <Card>
                <h3 className="font-bold mb-4">Récapitulatif</h3>

                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-gray-600 mb-2">Services sélectionnés :</p>
                    {selectedServices.length > 0 ? (
                      <ul className="space-y-1">
                        {selectedServices.map((s) => (
                          <li key={s._id} className="flex justify-between">
                            <span>{s.name}</span>
                            <span className="font-semibold">{s.price} DT</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400 italic">Aucun service sélectionné</p>
                    )}
                  </div>

                  {selectedDate && (
                    <div>
                      <p className="text-gray-600 mb-1">Date :</p>
                      <p className="font-semibold">
                        {format(new Date(selectedDate), 'd MMMM yyyy', { locale: fr })}
                      </p>
                    </div>
                  )}

                  {selectedSlot && (
                    <div>
                      <p className="text-gray-600 mb-1">Heure :</p>
                      <p className="font-semibold">{selectedSlot.time}</p>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-purple-600">{calculateTotalPrice()} DT</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;