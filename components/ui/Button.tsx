import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = 'px-6 py-3 font-mono font-bold text-lg uppercase tracking-wider border-2 rounded-md transition-all duration-300 transform focus:outline-none focus:ring-4';
  
  const variantClasses = {
    primary: 'border-raiku-lime text-raiku-lime bg-black hover:bg-raiku-lime hover:text-black hover:shadow-raiku-lime focus:ring-raiku-lime/50',
    secondary: 'border-neon-pink text-neon-pink bg-black hover:bg-neon-pink hover:text-black hover:shadow-neon-pink focus:ring-neon-pink/50',
    success: 'border-raiku-lime text-raiku-lime bg-black hover:bg-raiku-lime hover:text-black hover:shadow-raiku-lime focus:ring-raiku-lime/50',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};