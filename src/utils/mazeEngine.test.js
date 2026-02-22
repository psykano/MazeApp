import { generateMaze } from './mazeEngine';

const countDeadEnds = (maze, { excludeEndpoints = false } = {}) => {
    const height = maze.grid.length;
    const width = maze.grid[0].length;
    let count = 0;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (excludeEndpoints) {
                const isStart = x === maze.start.x && y === maze.start.y;
                const isEnd = x === maze.end.x && y === maze.end.y;
                if (isStart || isEnd) continue;
            }

            const w = maze.grid[y][x].walls;
            const wallsCount = [w.N, w.S, w.E, w.W].filter(Boolean).length;
            if (wallsCount === 3) count++;
        }
    }

    return count;
};

const createSeededRandom = (seed = 123456789) => {
    let state = seed >>> 0;
    return () => {
        state = (1664525 * state + 1013904223) >>> 0;
        return state / 4294967296;
    };
};

describe('Maze Engine', () => {
    it('generates a grid of the correct dimensions', () => {
        const maze = generateMaze(10, 15, 1.0); // 1.0 means don't remove any dead-ends (Perfect Maze)
        expect(maze.grid.length).toBe(15); // height (rows)
        expect(maze.grid[0].length).toBe(10); // width (cols)
    });

    it('exposes a valid start and end coordinate', () => {
        const maze = generateMaze(10, 10, 1.0);
        expect(maze.start).toBeDefined();
        expect(maze.end).toBeDefined();
        expect(maze.start.x).toBeGreaterThanOrEqual(0);
        expect(maze.start.y).toBeGreaterThanOrEqual(0);
    });

    it('initially generates a perfect maze where all cells are visited', () => {
        const maze = generateMaze(5, 5, 1.0);
        let unvisited = 0;
        for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 5; x++) {
                if (!maze.grid[y][x].visited) unvisited++;
            }
        }
        expect(unvisited).toBe(0);
    });

    it('creates cells with wall data', () => {
        const maze = generateMaze(2, 2, 1.0);
        const cell = maze.grid[0][0];
        expect(cell).toHaveProperty('walls');
        expect(cell.walls).toHaveProperty('N');
        expect(cell.walls).toHaveProperty('S');
        expect(cell.walls).toHaveProperty('E');
        expect(cell.walls).toHaveProperty('W');
    });

    it('keeps walls symmetric between adjacent cells after braiding', () => {
        const maze = generateMaze(20, 20, 0.1, createSeededRandom(101));

        for (let y = 0; y < 20; y++) {
            for (let x = 0; x < 20; x++) {
                const cell = maze.grid[y][x];
                if (x < 19) {
                    expect(cell.walls.E).toBe(maze.grid[y][x + 1].walls.W);
                }
                if (y < 19) {
                    expect(cell.walls.S).toBe(maze.grid[y + 1][x].walls.N);
                }
            }
        }
    });

    it('reduces dead-ends as density decreases', () => {
        const width = 20;
        const height = 20;
        const seed = 42;

        const lightBraidMaze = generateMaze(width, height, 0.9, createSeededRandom(seed));
        const mediumBraidMaze = generateMaze(width, height, 0.5, createSeededRandom(seed));
        const heavyBraidMaze = generateMaze(width, height, 0.1, createSeededRandom(seed));
        const perfectMaze = generateMaze(width, height, 1.0, createSeededRandom(seed));

        const lightBraidDeadEnds = countDeadEnds(lightBraidMaze, { excludeEndpoints: true });
        const mediumBraidDeadEnds = countDeadEnds(mediumBraidMaze, { excludeEndpoints: true });
        const heavyBraidDeadEnds = countDeadEnds(heavyBraidMaze, { excludeEndpoints: true });
        const perfectDeadEnds = countDeadEnds(perfectMaze, { excludeEndpoints: true });

        expect(heavyBraidDeadEnds).toBeLessThanOrEqual(mediumBraidDeadEnds);
        expect(mediumBraidDeadEnds).toBeLessThanOrEqual(lightBraidDeadEnds);
        expect(lightBraidDeadEnds).toBeLessThanOrEqual(perfectDeadEnds);
    });

    it('keeps non-endpoint dead-ends near target retention', () => {
        const width = 20;
        const height = 20;
        const density = 0.5;
        const seed = 777;

        const perfectMaze = generateMaze(width, height, 1.0, createSeededRandom(seed));
        const braidedMaze = generateMaze(width, height, density, createSeededRandom(seed));

        const perfectDeadEnds = countDeadEnds(perfectMaze, { excludeEndpoints: true });
        const braidedDeadEnds = countDeadEnds(braidedMaze, { excludeEndpoints: true });
        const targetDeadEnds = Math.floor(perfectDeadEnds * density);

        expect(braidedDeadEnds).toBeLessThan(perfectDeadEnds);
        expect(braidedDeadEnds).toBeLessThanOrEqual(targetDeadEnds + 2);
    });

    it('clamps dead-end density when values are outside 0-1', () => {
        const width = 20;
        const height = 20;
        const seed = 909;

        const belowRangeMaze = generateMaze(width, height, -1, createSeededRandom(seed));
        const zeroMaze = generateMaze(width, height, 0, createSeededRandom(seed));
        const aboveRangeMaze = generateMaze(width, height, 2, createSeededRandom(seed));
        const fullDensityMaze = generateMaze(width, height, 1, createSeededRandom(seed));

        const belowRangeDeadEnds = countDeadEnds(belowRangeMaze, { excludeEndpoints: true });
        const zeroDeadEnds = countDeadEnds(zeroMaze, { excludeEndpoints: true });
        const aboveRangeDeadEnds = countDeadEnds(aboveRangeMaze, { excludeEndpoints: true });
        const fullDensityDeadEnds = countDeadEnds(fullDensityMaze, { excludeEndpoints: true });

        expect(belowRangeDeadEnds).toBe(zeroDeadEnds);
        expect(aboveRangeDeadEnds).toBe(fullDensityDeadEnds);
    });
});
