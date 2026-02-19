export const generateMaze = (width, height, deadEndDensity = 1.0) => {
    // Initialize grid
    const grid = [];
    for (let y = 0; y < height; y++) {
        const row = [];
        for (let x = 0; x < width; x++) {
            row.push({
                x, y,
                visited: false,
                walls: { N: true, S: true, E: true, W: true }
            });
        }
        grid.push(row);
    }

    // Recursive Backtracker to generate PERFECT maze
    const startX = 0;
    const startY = 0;
    let current = grid[startY][startX];
    current.visited = true;
    const stack = [current];

    const getUnvisitedNeighbors = (cell) => {
        const neighbors = [];
        const { x, y } = cell;
        if (y > 0 && !grid[y - 1][x].visited) neighbors.push({ dir: 'N', cell: grid[y - 1][x] });
        if (y < height - 1 && !grid[y + 1][x].visited) neighbors.push({ dir: 'S', cell: grid[y + 1][x] });
        if (x > 0 && !grid[y][x - 1].visited) neighbors.push({ dir: 'W', cell: grid[y][x - 1] });
        if (x < width - 1 && !grid[y][x + 1].visited) neighbors.push({ dir: 'E', cell: grid[y][x + 1] });
        return neighbors;
    };

    const removeWall = (cellA, cellB, dir) => {
        const op = { N: 'S', S: 'N', E: 'W', W: 'E' };
        cellA.walls[dir] = false;
        cellB.walls[op[dir]] = false;
    };

    while (stack.length > 0) {
        const neighbors = getUnvisitedNeighbors(current);
        if (neighbors.length > 0) {
            const next = neighbors[Math.floor(Math.random() * neighbors.length)];
            removeWall(current, next.cell, next.dir);
            next.cell.visited = true;
            stack.push(current);
            current = next.cell;
        } else {
            current = stack.pop();
        }
    }

    // Braid Maze Logic (Remove dead-ends based on density)
    // deadEndDensity: 1.0 = keep all, 0.0 = remove all possible
    if (deadEndDensity < 1.0) {
        const getDeadEnds = () => {
            const deadEnds = [];
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const w = grid[y][x].walls;
                    // Start and End nodes are naturally dead-ends usually, skip removing them
                    if ((x === 0 && y === 0) || (x === width - 1 && y === height - 1)) continue;

                    if ([w.N, w.S, w.E, w.W].filter(Boolean).length === 3) {
                        deadEnds.push(grid[y][x]);
                    }
                }
            }
            return deadEnds;
        };

        let deadEnds = getDeadEnds();
        // We shuffle deadEnds so removing them is random
        deadEnds.sort(() => Math.random() - 0.5);

        // Number of dead ends to KEEP
        const targetDeadEnds = Math.floor(deadEnds.length * deadEndDensity);

        while (deadEnds.length > targetDeadEnds) {
            const cell = deadEnds.pop();
            const { x, y, walls } = cell;

            // Find a valid adjacent cell to break a wall into that isn't out of bounds
            const validDirections = [];
            if (y > 0 && walls.N) validDirections.push({ dir: 'N', neighbor: grid[y - 1][x] });
            if (y < height - 1 && walls.S) validDirections.push({ dir: 'S', neighbor: grid[y + 1][x] });
            if (x < width - 1 && walls.E) validDirections.push({ dir: 'E', neighbor: grid[y][x + 1] });
            if (x > 0 && walls.W) validDirections.push({ dir: 'W', neighbor: grid[y][x - 1] });

            if (validDirections.length > 0) {
                // Prefer breaking into cells that are NOT dead ends themselves to prevent massive empty rooms,
                // but for simplicity, just pick a random valid direction.
                const next = validDirections[Math.floor(Math.random() * validDirections.length)];
                removeWall(cell, next.neighbor, next.dir);
            }
        }
    }

    return {
        grid,
        start: { x: 0, y: 0 },
        end: { x: width - 1, y: height - 1 }
    };
};
