import React, { useEffect, useRef } from 'react';

const CSSParticleEffect = ({
  children,
  particles = 20,
  colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'],
  speed = 2,
  direction = 'random',
  className = ''
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createParticle = () => {
      const particle = document.createElement('div');
      const size = Math.random() * 8 + 4;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        pointer-events: none;
        opacity: 0;
        animation: particle-fade ${speed}s ease-out forwards;
      `;

      // Random position
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      particle.style.left = `${x}%`;
      particle.style.top = `${y}%`;

      // Random direction
      const angle = Math.random() * Math.PI * 2;
      const velocity = (Math.random() * 50 + 50) * speed;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity;

      particle.style.setProperty('--tx', `${tx}px`);
      particle.style.setProperty('--ty', `${ty}px`);

      container.appendChild(particle);

      // Remove particle after animation
      setTimeout(() => {
        particle.remove();
      }, speed * 1000);
    };

    // Create particles
    for (let i = 0; i < particles; i++) {
      setTimeout(() => createParticle(), i * 50);
    }
  }, [particles, colors, speed, direction]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <style>{`
        @keyframes particle-fade {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(var(--tx), var(--ty)) scale(0);
          }
        }
      `}</style>
      {children}
    </div>
  );
};

export default CSSParticleEffect;