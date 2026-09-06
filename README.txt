URBAN THREADS CLOTHING — Static Website with Full-Site Antigravity Moving Background

Features:
- Full-site Antigravity 3D Particle Simulation from React Bits (Three.js + React Three Fiber)
- Continuous weightless floating particles drifting across the entire website
- Global cursor attraction: moving the pointer anywhere on the screen pulls particles into a magnetic wave ring
- Auto-animates when idle with smooth harmonic ripples
- Dynamic moving ambient gradient aura (CSS keyframe mesh) and technical grid overlay
- Translucent, glassmorphic UI elements allowing the 3D particles to drift behind text, cards, and forms
- Sign-up flow and collection access

Files & Structure:
- index.html                     : landing page with full-site Antigravity background
- shop.html                      : collection page with full-site Antigravity background
- style.css                      : styling, ambient moving gradient, glassmorphism
- script.js                      : signup validation + session storage redirect logic
- src/components/Antigravity.jsx : React Bits Antigravity 3D particle component
- src/App.jsx                    : application wrapper configuring full-site Antigravity background
- src/main.jsx                   : entrypoint mounting Antigravity to #antigravity-bg
- vite.config.js                 : Vite configuration for MPA build and React plugin
- package.json                   : dependencies (three, @react-three/fiber, react, react-dom, vite)

How to Run:
1. Development Mode:
   npm run dev
   Opens local development server with instant hot-reloading.

2. Production Build:
   npm run build
   Compiles optimized production assets into the 'dist/' folder.

3. Preview Production Build:
   npm run preview
   Serves the production build locally at http://localhost:4173/
