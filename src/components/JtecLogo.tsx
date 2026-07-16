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
        className="h-20 md:h-24 w-auto object-contain max-h-[140%] z-20"
        id="joy-fast-fly-logo"
      />
    </div>
  );
};
