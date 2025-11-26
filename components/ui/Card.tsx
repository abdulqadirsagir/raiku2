import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-gray-900/50 border border-gray-700 backdrop-blur-sm p-6 md:p-8 rounded-lg ${className}`}>
      {children}
    </div>
  );
};