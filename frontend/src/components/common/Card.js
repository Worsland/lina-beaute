import React from 'react';

const Card = ({
  children,
  className = '',
  hover = false,
  padding = true,
  onClick,
}) => {
  const hoverClasses = hover ? 'hover:shadow-2xl transform hover:-translate-y-1 cursor-pointer' : '';
  const paddingClasses = padding ? 'p-6' : '';

  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-xl shadow-md transition-all duration-300
        ${hoverClasses}
        ${paddingClasses}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;