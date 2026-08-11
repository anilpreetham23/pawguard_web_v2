import React from 'react';
import { Fade, Slide, Zoom, Bounce, Flip, Rotate, Roll, HeadShake, JackInTheBox, LightSpeed, Pulse, RubberBand, Shake, Swing, Tada, Wobble } from 'react-awesome-reveal';

const ScrollReveal = ({
  children,
  animation = 'fade',
  direction = 'up',
  delay = 0,
  duration = 500,
  triggerOnce = true,
  className = ''
}) => {
  const getAnimationComponent = () => {
    switch (animation) {
      case 'fade':
        return <Fade delay={delay} duration={duration} triggerOnce={triggerOnce}>{children}</Fade>;
      case 'slide':
        return <Slide direction={direction} delay={delay} duration={duration} triggerOnce={triggerOnce}>{children}</Slide>;
      case 'zoom':
        return <Zoom delay={delay} duration={duration} triggerOnce={triggerOnce}>{children}</Zoom>;
      case 'bounce':
        return <Bounce delay={delay} duration={duration} triggerOnce={triggerOnce}>{children}</Bounce>;
      case 'flip':
        return <Flip delay={delay} duration={duration} triggerOnce={triggerOnce}>{children}</Flip>;
      case 'rotate':
        return <Rotate delay={delay} duration={duration} triggerOnce={triggerOnce}>{children}</Rotate>;
      case 'roll':
        return <Roll delay={delay} duration={duration} triggerOnce={triggerOnce}>{children}</Roll>;
      case 'headShake':
        return <HeadShake delay={delay} duration={duration} triggerOnce={triggerOnce}>{children}</HeadShake>;
      case 'jackInTheBox':
        return <JackInTheBox delay={delay} duration={duration} triggerOnce={triggerOnce}>{children}</JackInTheBox>;
      case 'lightSpeed':
        return <LightSpeed delay={delay} duration={duration} triggerOnce={triggerOnce}>{children}</LightSpeed>;
      case 'pulse':
        return <Pulse delay={delay} duration={duration} triggerOnce={triggerOnce}>{children}</Pulse>;
      case 'rubberBand':
        return <RubberBand delay={delay} duration={duration} triggerOnce={triggerOnce}>{children}</RubberBand>;
      case 'shake':
        return <Shake delay={delay} duration={duration} triggerOnce={triggerOnce}>{children}</Shake>;
      case 'swing':
        return <Swing delay={delay} duration={duration} triggerOnce={triggerOnce}>{children}</Swing>;
      case 'tada':
        return <Tada delay={delay} duration={duration} triggerOnce={triggerOnce}>{children}</Tada>;
      case 'wobble':
        return <Wobble delay={delay} duration={duration} triggerOnce={triggerOnce}>{children}</Wobble>;
      default:
        return <Fade delay={delay} duration={duration} triggerOnce={triggerOnce}>{children}</Fade>;
    }
  };

  return (
    <div className={className}>
      {getAnimationComponent()}
    </div>
  );
};

// Staggered reveal for lists
export const StaggeredReveal = ({
  children,
  animation = 'fade',
  staggerDelay = 100,
  className = ''
}) => {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <ScrollReveal
          animation={animation}
          delay={index * staggerDelay}
          triggerOnce={true}
        >
          {child}
        </ScrollReveal>
      ))}
    </div>
  );
};

// Parallax effect component
export const ParallaxReveal = ({
  children,
  speed = 0.5,
  className = ''
}) => {
  return (
    <Fade
      triggerOnce={true}
      distance="20%"
      transform={`translateY(${speed * 100}px)`}
    >
      <div className={className}>
        {children}
      </div>
    </Fade>
  );
};

export default ScrollReveal;