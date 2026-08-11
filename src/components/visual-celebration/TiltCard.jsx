import React from 'react';
import Tilt from 'react-parallax-tilt';

const TiltCard = ({
  children,
  tiltEnable = true,
  tiltMaxAngle = 15,
  tiltSpeed = 400,
  glareEnable = true,
  glareMaxOpacity = 0.8,
  glareColor = '#ffffff',
  glarePosition = 'all',
  scale = 1.02,
  perspective = 1000,
  className = '',
  style = {}
}) => {
  return (
    <Tilt
      tiltEnable={tiltEnable}
      tiltMaxAngleX={tiltMaxAngle}
      tiltMaxAngleY={tiltMaxAngle}
      tiltSpeed={tiltSpeed}
      glareEnable={glareEnable}
      glareMaxOpacity={glareMaxOpacity}
      glareColor={glareColor}
      glarePosition={glarePosition}
      glareBorderRadius="12px"
      scale={scale}
      perspective={perspective}
      className={`parallax-effect ${className}`}
      style={style}
    >
      <div className="inner-element">
        {children}
      </div>
    </Tilt>
  );
};

// Magnetic effect component
export const MagneticCard = ({
  children,
  strength = 0.3,
  className = ''
}) => {
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const deltaX = (x - centerX) * strength;
    const deltaY = (y - centerY) * strength;
    
    card.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'translate(0, 0)';
  };

  return (
    <div
      className={`transition-transform duration-300 ease-out ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

// Glow effect component
export const GlowCard = ({
  children,
  glowColor = '#3B82F6',
  glowIntensity = 0.5,
  className = ''
}) => {
  return (
    <div
      className={`relative group ${className}`}
      style={{
        '--glow-color': glowColor,
        '--glow-intensity': glowIntensity
      }}
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300 group-hover:duration-200"></div>
      <div className="relative bg-white dark:bg-slate-800 rounded-lg p-6">
        {children}
      </div>
    </div>
  );
};

// Scale on hover effect
export const ScaleCard = ({
  children,
  scale = 1.05,
  className = ''
}) => {
  return (
    <div
      className={`transition-transform duration-300 hover:scale-${scale === 1.05 ? '[1.05]' : scale === 1.1 ? '[1.1]' : scale} ${className}`}
    >
      {children}
    </div>
  );
};

// Float effect component
export const FloatCard = ({
  children,
  floatIntensity = 10,
  className = ''
}) => {
  return (
    <div
      className={`animate-float ${className}`}
      style={{
        animationDuration: '3s',
        animationTimingFunction: 'ease-in-out',
        animationIterationCount: 'infinite',
        '--float-intensity': `${floatIntensity}px`
      }}
    >
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(calc(-1 * var(--float-intensity)));
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
      {children}
    </div>
  );
};

export default TiltCard;