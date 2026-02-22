import React from 'react';
import Card from './Card';
import { Star, ThumbUp } from '@mui/icons-material';
import { formatDate } from '../../utils/helpers';

const ReviewCard = ({ review }) => {
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        fontSize="small"
        className={index < rating ? 'text-yellow-500' : 'text-gray-300'}
      />
    ));
  };

  return (
    <Card>
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
          {review.client?.firstName?.[0]}{review.client?.lastName?.[0]}
        </div>

        <div className="flex-1">
          {/* En-tête */}
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-semibold text-gray-900">
                {review.client?.firstName} {review.client?.lastName?.[0]}.
              </p>
              <div className="flex items-center space-x-2">
                <div className="flex">{renderStars(review.rating)}</div>
                <span className="text-sm text-gray-500">
                  {formatDate(review.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Commentaire */}
          <p className="text-gray-700 mb-3">{review.comment}</p>

          {/* Photos */}
          {review.photos && review.photos.length > 0 && (
            <div className="flex gap-2 mb-3">
              {review.photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo.url}
                  alt={photo.caption}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              ))}
            </div>
          )}

          {/* Réponse de l'établissement */}
          {review.response && (
            <div className="mt-3 pl-4 border-l-2 border-purple-200 bg-purple-50 p-3 rounded">
              <p className="text-sm font-semibold text-purple-900 mb-1">
                Réponse de l'établissement
              </p>
              <p className="text-sm text-gray-700">{review.response.text}</p>
              <p className="text-xs text-gray-500 mt-1">
                {formatDate(review.response.date)}
              </p>
            </div>
          )}

          {/* Bouton utile */}
          <div className="flex items-center space-x-2 mt-3 text-sm text-gray-500">
            <button className="flex items-center space-x-1 hover:text-purple-600 transition-colors">
              <ThumbUp fontSize="small" />
              <span>Utile ({review.helpful || 0})</span>
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ReviewCard;