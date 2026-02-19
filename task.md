# Task Plan: 2D Maze Web Application

- [x] Finalize Product Requirements Document (PRD) via user interviews
- [x] Create README.md file

## Phase 1: Foundation & Setup
- [ ] Scaffold React Application
  - Initialize Vite React project
  - Clean up boilerplate code
  - Install base dependencies (e.g., CSS preprocessor if needed, or stick to Vanilla CSS)
- [ ] Configure Docker environment
  - Create `Dockerfile` for React SPA
  - Create `docker-compose.yml`

## Phase 2: Core Infrastructure
- [ ] Setup Theme & CSS Architecture
  - Implement Vanilla CSS framework structure
  - Create CSS variables for Cyberpunk Theme (Dark/Light mode)
  - Implement theme toggle logic in React
- [ ] Implement Pre-game Configuration UI
  - Create `ConfigMenu` component
  - Add discrete Difficulty UI (Easy, Normal, Hard)
  - Add granular "Custom" mode sliders (Width, Height, Dead-end density)
  - Implement dynamic time calculus logic based on grid size & difficulty

## Phase 3: Maze Engine
- [ ] Implement Maze Generation Algorithm
  - Create base grid data structure
  - Implement "Perfect Maze" algorithm (Recursive Backtracker)
  - Implement "Braid Maze" logic (loops/few dead-ends) for lower difficulties
  - Expose start and end coordinates explicitly

## Phase 4: Gameplay & Rendering
- [ ] Set up `<canvas>` rendering logic
  - Draw maze walls based on generated data structure
  - Implement viewport scaling/zooming logic ensuring entire maze fits on screen
  - Apply Cyberpunk aesthetic to walls and background
- [ ] Implement User Drawing Mechanics
  - Capture mouse/touch events on canvas
  - Implement "Snappy" dragging logic to centralize path within grid corridors
  - Add visual "comet trail" for the drawn path
- [ ] Implement Gameplay Validation logic
  - Track path collision against walls
  - Add "forgiving" logic for cornering
  - Trigger "Game Over" on direct wall collisions

## Phase 5: Game Loop & Polish
- [ ] Implement Timer System
  - Create ticking visual Progress Bar at the top of the canvas
  - Add intense ticking audio during the final countdown
- [ ] Build Post-Game Screens
  - Create Win screen showing stats (time taken)
  - Create Loss screens (Timeout vs Collision reasons)
  - Hook screens up to "Play Again" and "Change Settings" actions
- [ ] Final Polish & Testing
  - Ensure mobile responsivness
  - Test edge cases in maze generation and canvas touch inputs
