import React from 'react';

const XIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 9.696h-6.632l-5.22-5.956-6.015 5.956H1.5l7.732-8.98L1.254 2.25H8.08l4.713 5.363L18.244 2.25zm-1.562 18.25h2.44l-10.6-12.074H6.08l10.6 12.074z"></path>
    </svg>
);

const DiscordIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 128 96" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M107.7,8.3C100.2,3.3,91.8,0,82.8,0C72,0,62.1,2,53.2,5.8c-1.5,0.7-2.9,1.4-4.4,2.2c-1.5-0.8-2.9-1.5-4.4-2.2C35.5,2,25.6,0,14.8,0C5.8,0-2.6,3.3,5,8.3C-2.2,25.5,5,52,38.2,74.5c2,1.4,4,2.8,6.2,4.3c3.6,2.4,7.4,4.6,11.4,6.4c3.9,1.8,8,3.2,12.2,4.3c2.9,0.7,5.8,1.2,8.8,1.5c2.9-0.3,5.8-0.8,8.8-1.5c4.2-1.1,8.3-2.5,12.2-4.3c4-1.8,7.8-3.9,11.4-6.4c2.2-1.5,4.2-2.9,6.2-4.3C122.6,52,130.2,25.5,107.7,8.3z M42.4,62.8c-5.7,0-10.2-5.3-10.2-11.9s4.6-11.9,10.2-11.9c5.7,0,10.2,5.3,10.2,11.9S48.1,62.8,42.4,62.8z M85.2,62.8c-5.7,0-10.2-5.3-10.2-11.9s4.6-11.9,10.2-11.9c5.7,0,10.2,5.3,10.2,11.9S90.9,62.8,85.2,62.8z"/>
    </svg>
);


export const Socials: React.FC = () => {
  return (
    <section id="socials" className="flex flex-col items-center">
      <div className="flex gap-8">
        <a href="https://x.com/raikucom" target="_blank" rel="noopener noreferrer" aria-label="Follow Raiku on X" className="text-gray-400 hover:text-raiku-lime transition-colors">
          <XIcon className="h-8 w-8" />
        </a>
        <a href="https://discord.gg/raikucom" target="_blank" rel="noopener noreferrer" aria-label="Join the Raiku Discord" className="text-gray-400 hover:text-raiku-lime transition-colors">
          <DiscordIcon className="h-8 w-8" />
        </a>
      </div>
    </section>
  );
};