import React from 'react';

interface JtecLogoProps {
  className?: string;
  inverted?: boolean;
  logoUrl?: string;
}

export const JtecLogo: React.FC<JtecLogoProps> = ({ className = '', inverted = false, logoUrl }) => {
  return (
    <div className={`flex items-center select-none ${className}`} id="jtec-logo-container">
      <img
        src={logoUrl || "/logo.png"}
        alt="Joy Fast Fly Logo"
        onError={(e) => {
          // Fallback if the Supabase URL fails
          (e.target as HTMLImageElement).src = "/logo.png";
        }}
        className="h-16 md:h-20 w-auto object-contain transition-all duration-300 hover:scale-105"
        id="joy-fast-fly-logo"
      />
    </div>
  );
};
