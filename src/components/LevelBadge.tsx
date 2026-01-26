import React from 'react';

interface LevelBadgeProps {
  level: number;
  className?: string;
  size?: number;
}

export const LevelBadge: React.FC<LevelBadgeProps> = ({ level, className = "", size = 40 }) => {
  // Determine style based on level
  let theme = {
    mainColor: '#4CAF50', // Green (Level 1-10)
    secondaryColor: '#2E7D32',
    borderColor: '#A5D6A7',
    wingColor: '#81C784'
  };

  if (level > 90) {
    // Mythic / Red-Gold
    theme = {
      mainColor: '#D50000',
      secondaryColor: '#8E0000',
      borderColor: '#FFD700',
      wingColor: '#FFAB00'
    };
  } else if (level > 60) {
    // Legendary / Gold
    theme = {
      mainColor: '#FFC107',
      secondaryColor: '#FF6F00',
      borderColor: '#FFF8E1',
      wingColor: '#FFECB3'
    };
  } else if (level > 30) {
    // Epic / Purple
    theme = {
      mainColor: '#7C4DFF',
      secondaryColor: '#4527A0',
      borderColor: '#B388FF',
      wingColor: '#D1C4E9'
    };
  } else if (level > 10) {
    // Rare / Blue
    theme = {
      mainColor: '#2979FF',
      secondaryColor: '#1565C0',
      borderColor: '#82B1FF',
      wingColor: '#BBDEFB'
    };
  }

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`} style={{ width: size, height: size / 2 }}>
      <svg 
        viewBox="0 0 100 50" 
        className="w-full h-full drop-shadow-md filter" 
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id={`grad-${level}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: theme.borderColor, stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: theme.mainColor, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: theme.secondaryColor, stopOpacity: 1 }} />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Wings / Background Decoration */}
        <path 
          d="M10,25 Q0,10 15,5 L30,15 L10,25 Z M90,25 Q100,10 85,5 L70,15 L90,25 Z" 
          fill={theme.wingColor} 
          stroke={theme.secondaryColor}
          strokeWidth="1"
          opacity="0.9"
        />

        {/* Main Badge Shape (Hexagon/Shield stretched) */}
        <path 
          d="M20,10 L80,10 L90,25 L80,40 L20,40 L10,25 Z" 
          fill={`url(#grad-${level})`} 
          stroke={theme.borderColor} 
          strokeWidth="1.5"
          filter="url(#glow)"
        />

        {/* Inner Highlight (Glossy Effect) */}
        <path 
          d="M25,12 L75,12 L82,22 L25,12 Z" 
          fill="rgba(255,255,255,0.4)" 
        />
        
        {/* Bottom Shadow inside */}
        <path 
          d="M25,38 L75,38 L82,28 L18,28 Z" 
          fill="rgba(0,0,0,0.2)" 
        />
      </svg>

      {/* Level Number */}
      <span 
        className="absolute z-10 font-black italic text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
        style={{ 
            fontSize: size * 0.35,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            transform: 'translateY(-1px)'
        }}
      >
        {level}
      </span>
      
      {/* "LV" Label small */}
      <span 
        className="absolute z-10 font-bold text-white/80"
        style={{ 
            fontSize: size * 0.15,
            left: size * 0.15,
            top: size * 0.15,
            transform: 'rotate(-10deg)'
        }}
      >
        Lv
      </span>
    </div>
  );
};
