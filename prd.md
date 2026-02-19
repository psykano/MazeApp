# Product Requirements Document (PRD): 2D Maze Web Application

## 1. Product Overview
The goal is to develop an interactive and highly configurable web application that generates 2D mazes. Users can customize the maze generation parameters (e.g., size, number of dead-ends) and attempt to solve the maze within a set time limit by drawing a continuous path from the start point to the end point.

## 2. Target Audience
- Puzzle enthusiasts and casual gamers looking for a quick, customizable challenge.
- Educators or parents who want engaging, scalable cognitive exercises for students/children.

## 3. Core Features & Requirements

### 3.1. Maze Configuration Options
Before starting a game, the user should be presented with a configuration UI to customize the upcoming maze:
- **Difficulty Presets:** Present discrete difficulty options (e.g., Easy, Normal, Hard) that automatically adjust the maze size, complexity, and time limit. Underneath these options, display the exact granular settings they configure.
- **Custom Mode:** Include a "Custom" configuration mode that reveals granular sliders so the user can finely tune the width, height, and dead-end density.
- **Time Limit:** Auto-calculate a firm time limit based on grid dimensions (width * height) and chosen difficulty.

### 3.2. Maze Generation Engine
- **Fully Fleshed-out Algorithm:** Implement a robust underlying maze generation algorithm that supports varying levels of complexity and dead-end densities.
- **Multiple Paths:** On lower difficulties, the algorithm must be capable of generating "braid" mazes (mazes with loops and fewer dead-ends) to allow multiple valid routes to the end.
- **Valid Path:** Ensure that the maze always has at least one valid path connecting the Start point and the End point.

### 3.3. Gameplay & Interaction
- **Canvas Rendering:** Render the maze efficiently using HTML5 `<canvas>`. The viewport must be scaled (zoomed out) so the entire maze is always visible on the screen at once, regardless of size. The maze walls should be designed subtly to let the user focus clearly on the drawn path.
- **Snappy & Forgiving Input:** Allow users to draw paths by touching or clicking the Start node and dragging. The drawn line must "snap" neatly to the center of the grid corridors. The input must be **forgiving**: if a user drags diagonally around corners or lightly clips a wall, the line smartly snaps through the turn without penalizing them.
- **Wall Collision Penalty:** If the user attempts to aggressively drag the line directly through a solid wall, the round ends in an immediate "Game Over" loss.
- **Harsh Countdown Timer:** A prominent, high-pressure visual progress bar situated at the top of the screen that depletes as time runs out.
- **Audio Feedback:** Play an intense, ticking audio sound effect when the timer reaches its critical final moments to elevate the stress.

### 3.4. Game States (Win/Loss)
- **Win:** The user drawing reaches the End point before the time expires.
- **Loss (Time Out):** The harsh countdown timer runs out.
- **Loss (Collision):** The user accidentally draws into a wall.
- **Post-Game Screen:** Display stats (time remaining, time taken, reason for loss) and offer options to "Play Again" or "Change Settings".

## 4. Technical Stack
- **Core Languages:** HTML5, CSS3, JavaScript (ES6+).
- **Rendering:** HTML5 `<canvas>` API provides excellent performance for drawing pixel lines and detecting wall boundaries.
- **Framework:** The application will be built as a Single Page Application (SPA) using **React**. React will smoothly handle the pre-game configurations, live gameplay states, and post-game screens.
- **Deployment:** Structure the app so it can be deployed via a provided `Dockerfile` and `docker-compose.yml` file as a standalone Docker container.

## 5. UI/UX Considerations
- **Responsive Layout:** The interface and the maze canvas must dynamically scale to remain playable on both desktop monitors and mobile touch screens.
- **Cyberpunk Theme:** Implement a distinct **Cyberpunk** aesthetic utilizing modern UI design. The app must include a toggle to switch between a **Dark Mode** and a **Light Mode** variant of the theme.
- **Path Visuals:** The path drawn by the user should appear as a subtle, glowing comet trail that smoothly follows your finger/mouse.

## 6. Future Enhancements (Post-MVP)
- **Fog of War:** Only reveal a limited radius around the player's current drawing location.
- **Leaderboards:** Save the best completion times using LocalStorage or a backend database.
- **Power-ups:** Pick up time-extensions or hints (showing the correct path for 1 second) scattered in the maze.
