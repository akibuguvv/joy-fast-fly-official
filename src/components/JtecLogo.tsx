import React from 'react';

interface JtecLogoProps {
  className?: string;
  inverted?: boolean;
}

export const JtecLogo: React.FC<JtecLogoProps> = ({ className = '', inverted = false }) => {
  return (
    <div className={`flex items-center select-none ${className}`} id="jtec-logo-container">
      <img
        src="/logo.png"
        alt="Joy Fast Fly Logo"
        className="h-16 md:h-20 w-auto object-contain transition-all duration-300 hover:scale-105"
        id="joy-fast-fly-logo"
      />
    </div>
  );
};
