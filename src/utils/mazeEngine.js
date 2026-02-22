const DIRECTION_VECTORS = [
    { dir: 'N', dx: 0, dy: -1 },
    { dir: 'S', dx: 0, dy: 1 },
    { dir: 'E', dx: 1, dy: 0 },
    { dir: 'W', dx: -1, dy: 0 }
];

const OPPOSITE_DIRECTION = { N: 'S', S: 'N', E: 'W', W: 'E' };

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const countWalls = (cell) => [cell.walls.N, cell.walls.S, cell.walls.E, cell.walls.W].filter(Boolean).length;

const isDeadEnd = (cell) => countWalls(cell) === 3;

const pickRandom = (items, randomFn) => items[Math.floor(randomFn() * items.length)];

export const generateMaze = (width, height, deadEndDensity = 1.0, randomFn = Math.random) => {
    const normalizedDensity = clamp(deadEndDensity, 0, 1);

    // Initialize grid
    const grid = [];
    for (let y = 0; y < height; y++) {
        const row = [];
        for (let x = 0; x < width; x++) {
            row.push({
                x,
                y,
                visited: false,
                walls: { N: true, S: true, E: true, W: true }
            });
        }
        grid.push(row);
    }

    const getUnvisitedNeighbors = (cell) => {
        const neighbors = [];
        for (const { dir, dx, dy } of DIRECTION_VECTORS) {
            const neighborX = cell.x + dx;
            const neighborY = cell.y + dy;

            if (neighborX < 0 || neighborX >= width || neighborY < 0 || neighborY >= height) continue;

            const neighborCell = grid[neighborY][neighborX];
            if (!neighborCell.visited) {
                neighbors.push({ dir, cell: neighborCell });
            }
        }
        return neighbors;
    };

    const removeWall = (cellA, cellB, dir) => {
        cellA.walls[dir] = false;
        cellB.walls[OPPOSITE_DIRECTION[dir]] = false;
    };

    const getDeadEnds = () => {
        const deadEnds = [];
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const isStart = x === 0 && y === 0;
                const isEnd = x === width - 1 && y === height - 1;
                if (isStart || isEnd) continue;

                const cell = grid[y][x];
                if (isDeadEnd(cell)) {
                    deadEnds.push(cell);
                }
            }
        }
        return deadEnds;
    };

    const getClosedNeighborOptions = (cell) => {
        const options = [];

        for (const { dir, dx, dy } of DIRECTION_VECTORS) {
            if (!cell.walls[dir]) continue;

            const neighborX = cell.x + dx;
            const neighborY = cell.y + dy;
            if (neighborX < 0 || neighborX >= width || neighborY < 0 || neighborY >= height) continue;

            const neighbor = grid[neighborY][neighborX];
            options.push({ dir, neighbor, neighborOpenings: 4 - countWalls(neighbor) });
        }

        return options;
    };

    // Recursive Backtracker to generate a perfect maze
    let current = grid[0][0];
    current.visited = true;
    const stack = [current];

    while (stack.length > 0) {
        const neighbors = getUnvisitedNeighbors(current);
        if (neighbors.length > 0) {
            const next = pickRandom(neighbors, randomFn);
            removeWall(current, next.cell, next.dir);
            next.cell.visited = true;
            stack.push(current);
            current = next.cell;
        } else {
            current = stack.pop();
        }
    }

    // Braid maze logic (remove dead-ends based on density).
    if (normalizedDensity < 1.0) {
        let deadEnds = getDeadEnds();
        const targetDeadEnds = Math.floor(deadEnds.length * normalizedDensity);
        const maxIterations = width * height * 8;
        let iterations = 0;

        while (deadEnds.length > targetDeadEnds && iterations < maxIterations) {
            const cell = pickRandom(deadEnds, randomFn);
            const closedOptions = getClosedNeighborOptions(cell);

            if (closedOptions.length === 0) {
                deadEnds = deadEnds.filter((deadEndCell) => deadEndCell !== cell);
                continue;
            }

            // Prefer connecting into neighbors with more openings to avoid forming large blank regions.
            const nonDeadEndOptions = closedOptions.filter(({ neighbor }) => !isDeadEnd(neighbor));
            const candidateOptions = nonDeadEndOptions.length > 0 ? nonDeadEndOptions : closedOptions;
            const maxNeighborOpenings = Math.max(...candidateOptions.map((option) => option.neighborOpenings));
            const bestOptions = candidateOptions.filter((option) => option.neighborOpenings === maxNeighborOpenings);
            const next = pickRandom(bestOptions, randomFn);

            removeWall(cell, next.neighbor, next.dir);
            deadEnds = getDeadEnds();
            iterations++;
        }
    }

    return {
        grid,
        start: { x: 0, y: 0 },
        end: { x: width - 1, y: height - 1 }
    };
};
