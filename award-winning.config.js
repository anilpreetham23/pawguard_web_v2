// Award-Winning Website Development Configuration
export default {
  // Award criteria weights
  criteria: {
    visualDesign: { weight: 25, name: "Visual Design" },
    userExperience: { weight: 25, name: "User Experience" },
    innovation: { weight: 25, name: "Innovation & Creativity" },
    technicalExecution: { weight: 25, name: "Technical Execution" }
  },

  // Performance budgets
  performance: {
    coreWebVitals: {
      LCP: { target: 2.5, unit: "seconds", priority: "high" },
      FID: { target: 100, unit: "milliseconds", priority: "high" },
      CLS: { target: 0.1, unit: "score", priority: "high" },
      INP: { target: 200, unit: "milliseconds", priority: "medium" }
    },
    animation: {
      fps: { target: 60, unit: "fps", priority: "high" },
      frameTime: { target: 16.67, unit: "ms", priority: "high" }
    }
  },

  // Visual celebration presets
  celebrations: {
    achievement: {
      effects: ["confetti-burst", "particle-explosion", "glow-pulse"],
      duration: 3000,
      intensity: "high"
    },
    success: {
      effects: ["confetti-fall", "sparkle-trail", "scale-bounce"],
      duration: 2000,
      intensity: "medium"
    },
    hover: {
      effects: ["magnetic-pull", "glow-highlight", "micro-interaction"],
      duration: 300,
      intensity: "low"
    },
    scroll: {
      effects: ["reveal-fade", "parallax-shift", "stagger-appear"],
      duration: 800,
      intensity: "medium"
    }
  },

  // Animation libraries configuration
  animations: {
    gsap: {
      enabled: true,
      plugins: ["ScrollTrigger", "TextPlugin", "MotionPathPlugin"]
    },
    framerMotion: {
      enabled: true,
      features: ["layout", "animate", "whileHover", "whileTap"]
    },
    reactSpring: {
      enabled: true,
      config: { mass: 1, tension: 280, friction: 20 }
    },
    lottie: {
      enabled: true,
      renderer: "svg",
      loop: true,
      autoplay: true
    }
  },

  // Component architecture
  components: {
    atomic: {
      atoms: ["Button", "Input", "Icon", "Text", "Image"],
      molecules: ["Card", "Modal", "Tooltip", "Alert", "Badge"],
      organisms: ["Header", "Footer", "Navigation", "Form", "Table"],
      templates: ["HomePage", "AboutPage", "ContactPage"],
      pages: ["index", "about", "contact"]
    },
    awardWinning: {
      hero: ["parallax", "particles", "3d", "video"],
      sections: ["scroll-reveal", "sticky", "parallax", "interactive"],
      navigation: ["magnetic", "morphing", "animated", "minimal"],
      forms: ["floating-label", "animated-validation", "multi-step"]
    }
  },

  // Design system themes
  themes: {
    modern: {
      colors: { primary: "#3B82F6", secondary: "#6B7280", accent: "#10B981" },
      typography: { fontFamily: "Inter", scale: 1.25 },
      spacing: { unit: 8, scale: [0, 1, 2, 3, 4, 6, 8, 12, 16, 24] }
    },
    bold: {
      colors: { primary: "#FF6B6B", secondary: "#4ECDC4", accent: "#45B7D1" },
      typography: { fontFamily: "Poppins", scale: 1.333 },
      spacing: { unit: 8, scale: [0, 0.5, 1, 1.5, 2, 3, 4, 6, 8] }
    },
    elegant: {
      colors: { primary: "#2D3436", secondary: "#636E72", accent: "#0984E3" },
      typography: { fontFamily: "Playfair Display", scale: 1.5 },
      spacing: { unit: 8, scale: [0, 1, 2, 3, 4, 5, 6, 8, 10] }
    }
  },

  // Testing and quality
  quality: {
    accessibility: {
      standard: "WCAG 2.1 AA",
      checks: ["color-contrast", "keyboard-navigation", "screen-reader", "aria-labels"]
    },
    performance: {
      budget: { totalSize: 3, jsSize: 300, cssSize: 100, imageSize: 1000 },
      monitoring: ["lighthouse", "web-vitals", "bundle-analyzer"]
    },
    testing: {
      unit: "vitest",
      integration: "vitest",
      e2e: "playwright",
      visual: "chromatic"
    }
  },

  // Deployment configuration
  deployment: {
    vercel: {
      framework: "vite",
      buildCommand: "npm run build",
      outputDirectory: "dist",
      nodeVersion: "18"
    },
    netlify: {
      buildCommand: "npm run build",
      publish: "dist",
      plugins: ["netlify-plugin-lighthouse"]
    }
  },

  // Tool integration
  tools: {
    figma: { enabled: true, sync: true },
    lottie: { enabled: true, editor: true },
    storybook: { enabled: true, addons: ["a11y", "docs", "mcp"] },
    chromatic: { enabled: true, autoAccept: true }
  }
};