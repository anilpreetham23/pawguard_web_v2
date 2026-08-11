import React, { useCallback } from 'react';
import confetti from 'canvas-confetti';

const ConfettiEffect = ({
  children,
  trigger = 'click',
  config = {},
  className = ''
}) => {
  const defaultConfig = {
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'],
    ...config
  };

  const fireConfetti = useCallback(() => {
    confetti(defaultConfig);
  }, [defaultConfig]);

  const handleInteraction = () => {
    if (trigger === 'click') {
      fireConfetti();
    }
  };

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      fireConfetti();
    }
  };

  return (
    <div
      className={`cursor-pointer ${className}`}
      onClick={handleInteraction}
      onMouseEnter={handleMouseEnter}
    >
      {children}
    </div>
  );
};

// Preset configurations
export const celebrationPresets = {
  achievement: {
    particleCount: 150,
    spread: 100,
    origin: { y: 0.5 },
    colors: ['#FFD700', '#FFA500', '#FF6347', '#32CD32', '#1E90FF']
  },
  success: {
    particleCount: 80,
    spread: 60,
    origin: { y: 0.7 },
    colors: ['#00C851', '#007E33', '#33B5E5', '#0099CC']
  },
  birthday: {
    particleCount: 200,
    spread: 160,
    origin: { y: 0.4 },
    colors: ['#FF69B4', '#FFB6C1', '#FF1493', '#C71585']
  },
  minimal: {
    particleCount: 30,
    spread: 40,
    origin: { y: 0.8 },
    colors: ['#3B82F6', '#6B7280', '#10B981']
  }
};

export default ConfettiEffect;