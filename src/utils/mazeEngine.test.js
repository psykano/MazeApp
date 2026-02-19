import { generateMaze } from './mazeEngine';

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

    it('reduces dead-ends when density is less than 1.0 (braid maze logic)', () => {
        // A 10x10 perfect maze usually has ~20-30 dead-ends.
        const perfectMaze = generateMaze(10, 10, 1.0);
        const braidedMaze = generateMaze(10, 10, 0.0); // 0.0 density means remove ALL dead-ends possible

        const countDeadEnds = (maze) => {
            let count = 0;
            for (let y = 0; y < 10; y++) {
                for (let x = 0; x < 10; x++) {
                    const w = maze.grid[y][x].walls;
                    const wallsCount = [w.N, w.S, w.E, w.W].filter(Boolean).length;
                    if (wallsCount === 3) count++;
                }
            }
            return count;
        };

        const perfectDeadEnds = countDeadEnds(perfectMaze);
        const braidedDeadEnds = countDeadEnds(braidedMaze);

        expect(braidedDeadEnds).toBeLessThan(perfectDeadEnds);
        // Ideally, a braided maze with 0 density has 0 dead ends (excluding corners sometimes)
        expect(braidedDeadEnds).toBeLessThanOrEqual(5);
    });
});
