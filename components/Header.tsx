import React from 'react';
import { RaikuLogo } from './RaikuLogo';

export const Header: React.FC = () => {
  return (
    <header className="flex flex-col items-center">
      <RaikuLogo className="h-12 md:h-16 w-auto text-raiku-lime drop-shadow-raiku-lime" />
      <p className="mt-4 text-gray-400 font-sans text-lg md:text-xl">The Inevitable Evolution of DeFi.</p>
    </header>
  );
};