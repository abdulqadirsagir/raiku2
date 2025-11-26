import React from 'react';

export const RaikuLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 116 36"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Raiku Logo"
  >
    {/* Text 'raiku' */}
    <text
      x="0"
      y="29"
      fontFamily="Inter, sans-serif"
      fontSize="30"
      fontWeight="700"
      letterSpacing="0.5"
    >
      raiku
    </text>
  </svg>
);