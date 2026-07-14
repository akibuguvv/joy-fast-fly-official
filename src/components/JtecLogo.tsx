import React from 'react';

interface JtecLogoProps {
  className?: string;
  inverted?: boolean;
}

export const JtecLogo: React.FC<JtecLogoProps> = ({ className = '', inverted = false }) => {
  const brandBlue = inverted ? '#ffffff' : '#0c316b';
  const brandRed = '#da1e28';
  const globeBlue = inverted ? '#93c5fd' : '#2563eb';
  const globeBg = inverted ? 'rgba(255,255,255,0.15)' : 'rgba(12,49,107,0.05)';

  return (
    <div className={`flex items-center select-none ${className}`} id="jtec-logo-container">
      {/* High-Fidelity Joy Fast Fly Vector SVG Logo */}
      <svg
        viewBox="0 0 450 160"
        className="h-11 md:h-14 w-auto"
        id="joy-fast-fly-vector-logo"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform="translate(10, 5)">
          {/* ====== THE GLOBE (Letter O) ====== */}
          <g transform="translate(160, 60)">
            {/* Globe Background */}
            <circle r="42" fill={globeBg} stroke={brandBlue} strokeWidth="2.5" />
            <circle r="42" fill="url(#globeGradient)" opacity="0.85" />
            
            {/* Map Contents (Simplified World Map for Premium Vector Look) */}
            {/* North America */}
            <path
              d="M -30,-22 C -24,-20 -20,-15 -25,-8 C -30,-1 -35,5 -38,0 C -40,-5 -35,-15 -30,-22 Z"
              fill={globeBlue}
              opacity="0.9"
            />
            {/* South America */}
            <path
              d="M -28,-5 C -22,0 -18,10 -22,20 C -26,30 -30,35 -30,35 C -32,35 -32,25 -30,15 C -28,5 -32,0 -28,-5 Z"
              fill={globeBlue}
              opacity="0.9"
            />
            {/* Eurasia & Africa */}
            <path
              d="M 5,-28 C 12,-32 25,-25 22,-15 C 19,-5 35,-2 30,12 C 25,26 15,32 8,28 C 1,24 5,12 2,5 C -1,-2 0,-15 5,-28 Z"
              fill={globeBlue}
              opacity="0.9"
            />
            {/* Greenland */}
            <path
              d="M -12,-32 C -8,-32 -5,-30 -8,-25 C -11,-20 -15,-25 -12,-32 Z"
              fill={globeBlue}
              opacity="0.95"
            />
            {/* Australia */}
            <path
              d="M 22,18 C 26,18 30,22 28,26 C 26,30 20,28 22,18 Z"
              fill={globeBlue}
              opacity="0.9"
            />
            {/* Longitude / Latitude Grid Lines */}
            <path
              d="M -42,0 A 42,42 0 0,0 42,0 M 0,-42 A 42,42 0 0,0 0,42 M -30,-30 A 42,42 0 0,0 30,-30 M -30,30 A 42,42 0 0,0 30,30"
              fill="none"
              stroke={inverted ? 'rgba(255,255,255,0.25)' : 'rgba(12,49,107,0.15)'}
              strokeWidth="1"
            />
          </g>

          {/* ====== THE SWEENING TAIL & RED SWOOSH LINE ====== */}
          {/* Elegant Red swoosh that curves under the globe and shoots up-right */}
          <path
            d="M 70,85 C 120,95 210,85 300,45 C 330,32 355,18 365,12"
            fill="none"
            stroke={brandRed}
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Symmetrical Blue accent swish below the red swoosh */}
          <path
            d="M 60,93 C 120,105 220,95 315,55"
            fill="none"
            stroke={brandBlue}
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.75"
          />

          {/* ====== LETTER J ====== */}
          <g transform="translate(60, 95)">
            {/* Big, bold stylized dynamic J */}
            <path
              d="M 45,-75 L 85,-75 L 70,-22 C 67,-10 60,3 48,8 C 36,13 24,11 12,8 C 0,5 -6,0 -2,-6 C 2,-12 12,-4 20,-2 C 28,0 33,-4 36,-12 L 52,-62 L 15,-62 L 18,-75 Z"
              fill={brandBlue}
            />
          </g>

          {/* ====== LETTER Y ====== */}
          <g transform="translate(265, 95)">
            {/* Big, bold stylized dynamic Y with red sweep intersection */}
            <path
              d="M -5,-75 L 30,-75 L 45,-42 L 68,-75 L 102,-75 L 55,-12 L 40,8 L 10,8 L 30,-22 Z"
              fill={brandBlue}
            />
          </g>

          {/* ====== THE JET AIRPLANE ====== */}
          {/* Detailed soaring commercial airplane silhouette */}
          <g transform="translate(365, 12) rotate(-22)">
            <path
              d="M -25,0 L -12,-5 L 5,-18 L 8,-18 L 2,-5 L 18,-2 L 24,-10 L 27,-10 L 25,0 L 27,10 L 24,10 L 18,2 L 2,5 L 8,18 L 5,18 L -12,5 L -25,0 Z"
              fill={brandBlue}
            />
            {/* Red engine glow */}
            <circle cx="-13" cy="0" r="2.5" fill={brandRed} />
          </g>

          {/* ====== "= FAST FLY =" TEXT ====== */}
          <g transform="translate(210, 135)">
            {/* Symmetrical side wings */}
            <path
              d="M -160,-6 L -105,-6 M -150,-12 L -115,-12 M -140,0 L -125,0"
              stroke={brandBlue}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            
            {/* Stylized Fast Fly text */}
            <text
              textAnchor="middle"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontWeight="900"
              fontStyle="italic"
              fontSize="24"
              letterSpacing="2.5"
              fill={brandBlue}
            >
              FAST FLY
            </text>

            <path
              d="M 105,-6 L 160,-6 M 115,-12 L 150,-12 M 125,0 L 140,0"
              stroke={brandBlue}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>

          {/* ====== RED & BLUE LOWER SWOOSH WAVE (Matches photo logo accent) ====== */}
          <path
            d="M 120,150 C 180,162 240,162 300,150"
            fill="none"
            stroke={brandRed}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M 150,154 C 190,162 230,162 270,154"
            fill="none"
            stroke={brandBlue}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>

        {/* GRADIENT DEFINITION */}
        <defs>
          <linearGradient id="globeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={inverted ? '#2563eb' : '#93c5fd'} stopOpacity="0.2" />
            <stop offset="100%" stopColor={inverted ? '#1d4ed8' : '#3b82f6'} stopOpacity="0.45" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
