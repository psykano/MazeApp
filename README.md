# 2D Maze Web Application

A highly configurable, interactive 2D maze generation and puzzle-solving web application built with React and HTML5 Canvas.

## Overview
This application drops the player into a 2D maze where they must draw a continuous path from the start point to the end point before a harsh countdown timer expires. It features an adaptive, "forgiving" responsive drawing mechanic designed perfectly for both touch screens and desktop mice.

## Features
- **Dynamic Maze Generation:** Generates valid perfect and "braid" mazes (with loops) on the fly.
- **Granular Customization:** Set difficulty via curated presets (Easy, Normal, Hard) or finely tune the dimensions and dead-end density using custom sliders. 
- **Snappy & Forgiving Controls:** When you draw, the line seamlessly "snaps" to the center of the corridors. It intelligently handles minor diagonal inputs around corners so you aren't unfairly penalized for slight dexterity slips.
- **High-Stakes Gameplay:** A prominent progress bar ticks down. Hitting a wall head-on results in an instant "Game Over".
- **Cyberpunk Aesthetic:** Play in either a glaring Light Mode or a moody Dark Mode, featuring a subtle, glowing comet trail tracking your every move.

## Setup & Deployment

### Docker Deployment
The application is fully containerized. You can effortlessly boot it up locally using Docker Compose:

```bash
# Start the application
docker compose up -d

# Stop the application
docker compose down
```

### Local Development (React/Vite)
If you prefer to run it locally without Docker:

```bash
# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

## Documentation
For more detailed information regarding the application logic, technical stack, and design decisions, please refer to the [Product Requirements Document (PRD)](./prd.md).
