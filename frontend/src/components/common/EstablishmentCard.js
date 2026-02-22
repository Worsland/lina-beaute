import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './Card';
import {
  LocationOn,
  Star,
  Euro,
  AccessTime,
} from '@mui/icons-material';

const EstablishmentCard = ({ establishment }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/establishments/${establishment._id}`);
  };

  // Extraire les initiales
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card hover onClick={handleClick} className="cursor-pointer">
      {/* Image ou placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100 rounded-t-xl -mx-6 -mt-6 mb-4 flex items-center justify-center overflow-hidden">
        {establishment.images && establishment.images[0] ? (
          <img
            src={establishment.images[0]}
            alt={establishment.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-6xl font-bold text-purple-300">
            {getInitials(establishment.name)}
          </div>
        )}
        
        {/* Badge catégorie */}
        <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-sm font-semibold text-purple-600 shadow-md">
          {establishment.category}
        </div>
      </div>

      {/* Contenu */}
      <div>
        {/* Nom et note */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900 flex-1">
            {establishment.name}
          </h3>
          {establishment.rating?.average > 0 && (
            <div className="flex items-center space-x-1 bg-purple-50 px-2 py-1 rounded-lg">
              <Star className="text-yellow-500" fontSize="small" />
              <span className="font-semibold text-gray-900">
                {establishment.rating.average.toFixed(1)}
              </span>
              <span className="text-sm text-gray-500">
                ({establishment.rating.count})
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {establishment.description}
        </p>

        {/* Informations */}
        <div className="space-y-2">
          {/* Localisation */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <LocationOn fontSize="small" className="text-purple-600" />
            <span>
              {establishment.address?.city || 'Tunis'}{establishment.distance && ` • ${establishment.distance}`}
            </span>
          </div>

          {/* Prix */}
          {establishment.priceRange && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Euro fontSize="small" className="text-purple-600" />
              <span>{establishment.priceRange}</span>
            </div>
          )}

          {/* Horaires */}
          {establishment.openingHours && establishment.openingHours.length > 0 && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <AccessTime fontSize="small" className="text-purple-600" />
              <span>Ouvert aujourd'hui</span>
            </div>
          )}
        </div>

        {/* Amenities (tags) */}
        {establishment.amenities && establishment.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {establishment.amenities.slice(0, 3).map((amenity, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {amenity}
              </span>
            ))}
            {establishment.amenities.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                +{establishment.amenities.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default EstablishmentCard;