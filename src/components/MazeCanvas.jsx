import React, { useRef, useEffect, useState } from 'react';
import { useTheme } from './ThemeProvider';
import './MazeCanvas.css';

const MazeCanvas = ({ maze, onWin, onLoss }) => {
    const { theme } = useTheme();
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [path, setPath] = useState([]); // Array of {x, y} grid logical coordinates visited

    // Dynamic metrics based on viewport and maze size
    const [metrics, setMetrics] = useState({ cellSize: 20, offsetX: 0, offsetY: 0 });

    const { grid, start, end } = maze;
    const width = grid[0].length;
    const height = grid.length;

    // Calculate scaling and center maze
    useEffect(() => {
        const calculateMetrics = () => {
            const container = containerRef.current;
            if (!container) return;
            const { clientWidth, clientHeight } = container;

            // Make sure canvas actually fills container physically
            const canvas = canvasRef.current;
            canvas.width = clientWidth;
            canvas.height = clientHeight;

            // Find the maximum cell size that allows the maze to fit the screen
            const cellW = clientWidth / width;
            const cellH = clientHeight / height;
            // We take the smaller to ensure it fits entirely, minus some padding
            const maxCellSize = Math.floor(Math.min(cellW, cellH) * 0.95);

            const mazePixelW = maxCellSize * width;
            const mazePixelH = maxCellSize * height;

            // Center it
            const offsetX = (clientWidth - mazePixelW) / 2;
            const offsetY = (clientHeight - mazePixelH) / 2;

            setMetrics({ cellSize: maxCellSize, offsetX, offsetY });
        };

        calculateMetrics();
        window.addEventListener('resize', calculateMetrics);
        return () => window.removeEventListener('resize', calculateMetrics);
    }, [width, height]);

    // Initial path setup
    useEffect(() => {
        setPath([{ x: start.x, y: start.y }]);
    }, [start]);

    // Draw loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const { cellSize, offsetX, offsetY } = metrics;
        if (cellSize === 0) return;

        // Hardcode colors based on theme to guarantee instant synchronous canvas updates
        const isLight = theme === 'light';
        const bg = isLight ? '#f0f0f5' : '#0d0d12';
        const wallColor = isLight ? '#ddddf0' : '#222233';
        const pathColor = isLight ? '#0055ff' : '#00ffcc';

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.lineWidth = Math.max(2, cellSize * 0.15); // Scale walls logically
        ctx.lineCap = 'square';

        // Draw grid walls
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const cell = grid[y][x];
                const px = offsetX + x * cellSize;
                const py = offsetY + y * cellSize;

                ctx.strokeStyle = wallColor;
                ctx.beginPath();
                if (cell.walls.N) { ctx.moveTo(px, py); ctx.lineTo(px + cellSize, py); }
                if (cell.walls.S) { ctx.moveTo(px, py + cellSize); ctx.lineTo(px + cellSize, py + cellSize); }
                if (cell.walls.E) { ctx.moveTo(px + cellSize, py); ctx.lineTo(px + cellSize, py + cellSize); }
                if (cell.walls.W) { ctx.moveTo(px, py); ctx.lineTo(px, py + cellSize); }
                ctx.stroke();

                // Draw Start/End blocks briefly for context
                if (x === start.x && y === start.y) {
                    ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
                    ctx.fillRect(px, py, cellSize, cellSize);
                }
                if (x === end.x && y === end.y) {
                    ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
                    ctx.fillRect(px, py, cellSize, cellSize);
                }
            }
        }

        // Draw the User Path
        if (path.length > 0) {
            ctx.beginPath();
            ctx.strokeStyle = pathColor;
            ctx.lineWidth = Math.max(3, cellSize * 0.3); // Path is thicker
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            // Cyberpunk glow
            ctx.shadowBlur = 10;
            ctx.shadowColor = pathColor;

            // Start at center of first cell
            ctx.moveTo(offsetX + path[0].x * cellSize + cellSize / 2, offsetY + path[0].y * cellSize + cellSize / 2);

            for (let i = 1; i < path.length; i++) {
                ctx.lineTo(offsetX + path[i].x * cellSize + cellSize / 2, offsetY + path[i].y * cellSize + cellSize / 2);
            }
            ctx.stroke();

            // Reset shadow for other draws
            ctx.shadowBlur = 0;
        }
    }, [grid, metrics, path, start, end, theme]);

    // Input Handling
    const getMouseCoords = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const getGridFromPixels = (px, py) => {
        const { cellSize, offsetX, offsetY } = metrics;
        const gx = Math.floor((px - offsetX) / cellSize);
        const gy = Math.floor((py - offsetY) / cellSize);
        return { x: gx, y: gy };
    };

    const startInteraction = (e) => {
        e.preventDefault();
        const pos = getMouseCoords(e);
        const gridPos = getGridFromPixels(pos.x, pos.y);

        // Only allow starting if they click near the actual current head of the path
        const head = path[path.length - 1];
        if (gridPos.x === head.x && gridPos.y === head.y) {
            setIsDrawing(true);
        }
    };

    const moveInteraction = (e) => {
        e.preventDefault();
        if (!isDrawing) return;

        const pos = getMouseCoords(e);
        const gridPos = getGridFromPixels(pos.x, pos.y);

        // Bounds check
        if (gridPos.x < 0 || gridPos.x >= width || gridPos.y < 0 || gridPos.y >= height) return;

        const head = path[path.length - 1];

        // If we moved to a new cell
        if (gridPos.x !== head.x || gridPos.y !== head.y) {
            // Are they purely adjacent?
            const dx = gridPos.x - head.x;
            const dy = gridPos.y - head.y;

            if (Math.abs(dx) + Math.abs(dy) === 1) {
                // Orthogonal move, check wall
                const headCell = grid[head.y][head.x];
                let hitWall = false;
                if (dx === 1 && headCell.walls.E) hitWall = true;
                if (dx === -1 && headCell.walls.W) hitWall = true;
                if (dy === 1 && headCell.walls.S) hitWall = true;
                if (dy === -1 && headCell.walls.N) hitWall = true;

                if (hitWall) {
                    setIsDrawing(false);
                    onLoss('Collision');
                    return;
                } else {
                    // Valid move, add to path
                    // If they backtracked, pop
                    if (path.length > 1 && path[path.length - 2].x === gridPos.x && path[path.length - 2].y === gridPos.y) {
                        setPath(prev => prev.slice(0, -1));
                    } else {
                        setPath(prev => [...prev, gridPos]);
                    }

                    // Check win
                    if (gridPos.x === end.x && gridPos.y === end.y) {
                        setIsDrawing(false);
                        onWin();
                    }
                }
            } else if (Math.abs(dx) === 1 && Math.abs(dy) === 1) {
                // Diagonal cornering attempt (Forgiving mechanic)
                // Check if there is an open L-shape connecting them safely

                let validPath = null;
                // Option 1: move X then Y
                if (!grid[head.y][head.x].walls[dx === 1 ? 'E' : 'W']) {
                    const cornerCellX = head.x + dx;
                    if (!grid[head.y][cornerCellX].walls[dy === 1 ? 'S' : 'N']) {
                        validPath = [{ x: cornerCellX, y: head.y }, gridPos];
                    }
                }
                // Option 2: move Y then X
                if (!validPath && !grid[head.y][head.x].walls[dy === 1 ? 'S' : 'N']) {
                    const cornerCellY = head.y + dy;
                    if (!grid[cornerCellY][head.x].walls[dx === 1 ? 'E' : 'W']) {
                        validPath = [{ x: head.x, y: cornerCellY }, gridPos];
                    }
                }

                if (validPath) {
                    setPath(prev => [...prev, ...validPath]);
                } else {
                    setIsDrawing(false);
                    onLoss('Collision');
                }
            }
        }
    };

    const endInteraction = () => {
        setIsDrawing(false);
    };

    return (
        <div className="canvas-container" ref={containerRef}>
            <canvas
                data-testid="maze-canvas"
                ref={canvasRef}
                onMouseDown={startInteraction}
                onMouseMove={moveInteraction}
                onMouseUp={endInteraction}
                onMouseLeave={endInteraction}
                onTouchStart={startInteraction}
                onTouchMove={moveInteraction}
                onTouchEnd={endInteraction}
                onTouchCancel={endInteraction}
            />
        </div>
    );
};

export default MazeCanvas;
