# Design System Guidelines

## Project: PawGuard Homepage Design

### Design Principles

1. **User-Centric Design** - Prioritize user needs and accessibility
2. **Consistency** - Maintain uniform design patterns throughout
3. **Simplicity** - Keep interfaces clean and intuitive
4. **Performance** - Optimize for speed and responsiveness

### Color System

#### Primary Colors
- **Primary Blue**: #3B82F6 (Tailwind blue-500)
- **Secondary Gray**: #6B7280 (Tailwind gray-500)
- **Accent Green**: #10B981 (Tailwind emerald-500)

#### Semantic Colors
- **Success**: #10B981 (emerald-500)
- **Warning**: #F59E0B (amber-500)
- **Error**: #EF4444 (red-500)
- **Info**: #3B82F6 (blue-500)

#### Dark Mode
- **Background**: #0F172A (slate-900)
- **Surface**: #1E293B (slate-800)
- **Text**: #F8FAFC (slate-50)

### Typography

#### Font Stack
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

#### Type Scale
- **H1**: 2.5rem (40px) - font-bold
- **H2**: 2rem (32px) - font-semibold
- **H3**: 1.5rem (24px) - font-semibold
- **H4**: 1.25rem (20px) - font-medium
- **Body**: 1rem (16px) - font-normal
- **Small**: 0.875rem (14px) - font-normal
- **Caption**: 0.75rem (12px) - font-light

### Spacing System

Use Tailwind's spacing scale:
- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)
- **2xl**: 3rem (48px)

### Component Guidelines

#### Buttons
- **Primary**: bg-blue-500 text-white hover:bg-blue-600
- **Secondary**: bg-gray-200 text-gray-800 hover:bg-gray-300
- **Outline**: border-2 border-blue-500 text-blue-500 hover:bg-blue-50
- **Padding**: px-4 py-2 (minimum)
- **Border Radius**: rounded-lg (8px)

#### Cards
- **Background**: bg-white dark:bg-slate-800
- **Shadow**: shadow-md
- **Border Radius**: rounded-xl (12px)
- **Padding**: p-6 (24px)
- **Hover**: shadow-lg transition-shadow duration-200

#### Forms
- **Input Height**: h-10 (40px)
- **Border**: border border-gray-300 focus:border-blue-500
- **Border Radius**: rounded-md (6px)
- **Padding**: px-3 py-2
- **Label**: text-sm font-medium text-gray-700 mb-1

### Animation Guidelines

#### Transitions
- **Duration**: 200ms (fast), 300ms (normal), 500ms (slow)
- **Easing**: ease-in-out for most animations
- **Properties**: transform, opacity, background-color

#### Micro-interactions
- **Hover Scale**: scale(1.02) for cards
- **Button Press**: scale(0.98) on active
- **Focus Ring**: ring-2 ring-blue-500 ring-offset-2

### Responsive Design

#### Breakpoints
- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md to lg)
- **Desktop**: > 1024px (xl+)

#### Mobile-First Approach
1. Design for mobile first
2. Enhance for larger screens
3. Use responsive utilities (sm:, md:, lg:)

### Accessibility (WCAG 2.1 AA)

#### Color Contrast
- **Normal Text**: 4.5:1 minimum contrast ratio
- **Large Text**: 3:1 minimum contrast ratio
- **UI Components**: 3:1 minimum contrast ratio

#### Keyboard Navigation
- **Tab Order**: Logical and intuitive
- **Focus States**: Visible focus indicators
- **Skip Links**: Provide skip-to-content links

#### Screen Reader Support
- **Alt Text**: Descriptive alt text for images
- **ARIA Labels**: Proper labeling for interactive elements
- **Semantic HTML**: Use appropriate HTML elements

### Performance Optimization

#### Image Optimization
- Use WebP format when possible
- Implement lazy loading
- Provide responsive images with srcset

#### Code Splitting
- Lazy load non-critical components
- Use React.lazy() for route-based splitting
- Implement code splitting with dynamic imports

### Design Tokens

#### CSS Variables
```css
:root {
  --color-primary: #3B82F6;
  --color-secondary: #6B7280;
  --color-accent: #10B981;
  --font-family: 'Inter', sans-serif;
  --spacing-unit: 1rem;
  --border-radius: 0.5rem;
}
```

### Component Library

This project uses:
- **Radix UI** - Accessible component primitives
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **GSAP** - Advanced animations
- **Lucide React** - Icon library

### Design Review Checklist

Before finalizing any design:
- [ ] Accessibility compliance (WCAG 2.1 AA)
- [ ] Responsive design across all breakpoints
- [ ] Color contrast meets requirements
- [ ] Keyboard navigation works properly
- [ ] Screen reader compatibility
- [ ] Performance impact assessment
- [ ] Cross-browser testing
- [ ] Mobile usability testing

## Visual Celebration Patterns

### Confetti & Particle Effects
```javascript
// Using canvas-confetti for celebration effects
import confetti from 'canvas-confetti';

const triggerCelebration = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
};

// Using tsparticles for complex particle systems
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const ParticleEffect = () => (
  <Particles
    id="tsparticles"
    init={loadSlim}
    options={{
      particles: {
        number: { value: 80 },
        color: { value: ["#ff6b6b", "#4ecdc4", "#45b7d1"] },
        move: { enable: true, speed: 6 }
      }
    }}
  />
);
```

### Dynamic Backgrounds
```javascript
// Animated gradient backgrounds
const AnimatedBackground = () => (
  <div className="animated-gradient">
    <style>{`
      .animated-gradient {
        background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
        background-size: 400% 400%;
        animation: gradient 15s ease infinite;
      }
      @keyframes gradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `}</style>
  </div>
);
```

### Scroll-Triggered Effects
```javascript
// Using react-awesome-reveal for scroll animations
import { Fade, Slide, Zoom } from "react-awesome-reveal";

const ScrollEffects = () => (
  <div>
    <Fade triggerOnce>
      <h2>Fade in on scroll</h2>
    </Fade>
    <Slide direction="left" triggerOnce>
      <p>Slide in from left</p>
    </Slide>
    <Zoom triggerOnce>
      <div>Zoom in effect</div>
    </Zoom>
  </div>
);

// Using react-intersection-observer
import { useInView } from 'react-intersection-observer';

const ScrollTrigger = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  
  return (
    <div ref={ref} className={inView ? 'animate-in' : 'opacity-0'}>
      Content appears when in view
    </div>
  );
};
```

### Interactive Hover Effects
```javascript
// Using react-parallax-tilt for tilt effects
import Tilt from 'react-parallax-tilt';

const TiltCard = () => (
  <Tilt
    className="parallax-effect"
    perspective={1000}
    glareEnable={true}
    glareMaxOpacity={0.8}
    scale={1.02}
  >
    <div className="inner-element">
      Hover for tilt effect
    </div>
  </Tilt>
);

// Using react-magic-motion for hover animations
import { MagicMotion } from "react-magic-motion";

const HoverCard = () => (
  <MagicMotion>
    <div className="hover-card">
      <p>Hover for magic animation</p>
    </div>
  </MagicMotion>
);
```

### Text Animation Effects
```javascript
// Using react-type-animation for typing effects
import { TypeAnimation } from 'react-type-animation';

const TypingEffect = () => (
  <TypeAnimation
    sequence={[
      'First line',
      1000,
      'Second line',
      1000,
      'Third line',
      1000
    ]}
    wrapper="span"
    speed={50}
    repeat={Infinity}
  />
);

// Using react-text-transition for text transitions
import TextTransition, { presets } from 'react-text-transition';

const TextEffect = () => {
  const [index, setIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <TextTransition
      text={TEXTS[index % TEXTS.length]}
      preset={presets.pop}
      transitionConfig={{ duration: 0.5 }}
    />
  );
};
```

## Advanced Animation Capabilities

### Physics-Based Animations
```javascript
// Using react-spring for physics-based animations
import { useSpring, animated } from '@react-spring/web';

const PhysicsAnimation = () => {
  const springs = useSpring({
    from: { opacity: 0, transform: 'translateY(-100px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { mass: 1, tension: 280, friction: 20 }
  });
  
  return <animated.div style={springs}>Physics-based animation</animated.div>;
};
```

### Auto-Animation
```javascript
// Using @formkit/auto-animate for simple animations
import { useAutoAnimate } from '@formkit/auto-animate';

const AutoAnimateList = () => {
  const [parent, enableAnimations] = useAutoAnimate();
  
  return (
    <ul ref={parent}>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
};
```

## Performance Monitoring

### Core Web Vitals Tracking
```javascript
// Using web-vitals for performance monitoring
import { onLCP, onFID, onCLS } from 'web-vitals';

function sendToAnalytics(metric) {
  console.log(metric);
  // Send to your analytics endpoint
}

onLCP(sendToAnalytics);
onFID(sendToAnalytics);
onCLS(sendToAnalytics);
```

### Bundle Analysis
```bash
# Analyze bundle size
npm run build -- --mode analyze
# or
npx vite-bundle-visualizer
```

## PWA Features

### Service Worker Registration
```javascript
// Using vite-plugin-pwa
import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('New content available. Reload?')) {
      updateSW();
    }
  },
  onOfflineReady() {
    console.log('App ready to work offline');
  }
});
```

## Accessibility Enhanced

### Focus Management
```javascript
// Using react-focus-lock for focus management
import FocusLock from 'react-focus-lock';

const Modal = ({ isOpen, onClose }) => (
  <FocusLock disabled={!isOpen}>
    <div role="dialog" aria-modal="true">
      {/* Modal content */}
      <button onClick={onClose}>Close</button>
    </div>
  </FocusLock>
);
```

### React Aria Components
```javascript
// Using react-aria for accessible components
import { useButton } from 'react-aria';
import { useRef } from 'react';

const AccessibleButton = () => {
  let ref = useRef();
  let { buttonProps } = useButton({}, ref);
  
  return (
    <button {...buttonProps} ref={ref}>
      Accessible Button
    </button>
  );
};
```

## Design Tokens Advanced

### Style Dictionary Integration
```javascript
// Using style-dictionary for design tokens
import StyleDictionary from 'style-dictionary';

const sd = StyleDictionary.extend({
  source: ['tokens/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'build/css/',
      files: [{
        destination: 'variables.css',
        format: 'css/variables'
      }]
    }
  }
});

sd.buildAllPlatforms();
```

## Canvas Graphics

### Fabric.js Integration
```javascript
// Using fabric.js for canvas graphics
import { fabric } from 'fabric';

const CanvasComponent = () => {
  useEffect(() => {
    const canvas = new fabric.Canvas('canvas');
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      width: 200,
      height: 100,
      fill: 'red'
    });
    canvas.add(rect);
  }, []);
  
  return <canvas id="canvas" width="800" height="600" />;
};
```

### Konva Integration
```javascript
// Using konva for 2D canvas
import { Stage, Layer, Rect } from 'konva';

const KonvaComponent = () => (
  <Stage width={800} height={600}>
    <Layer>
      <Rect
        x={100}
        y={100}
        width={200}
        height={100}
        fill="red"
        draggable
      />
    </Layer>
  </Stage>
);
```