import React from 'react';
import Card from './Card';
import Button from './Button';
import { AccessTime, Euro } from '@mui/icons-material';

const ServiceCard = ({ service, onBook }) => {
  return (
    <Card className="hover:shadow-xl transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            {service.name}
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            {service.description}
          </p>

          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <AccessTime fontSize="small" className="text-purple-600" />
              <span>{service.duration} min</span>
            </div>
            <div className="flex items-center space-x-1">
              <Euro fontSize="small" className="text-purple-600" />
              <span className="font-semibold text-lg text-purple-600">
                {service.price} DT
              </span>
            </div>
          </div>

          {/* Tags */}
          {service.tags && service.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {service.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="ml-4">
          <Button onClick={() => onBook(service)} size="sm">
            Réserver
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ServiceCard;