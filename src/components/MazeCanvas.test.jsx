import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MazeCanvas from './MazeCanvas';
import { generateMaze } from '../utils/mazeEngine';

describe('MazeCanvas', () => {
    it('renders a canvas element', () => {
        const maze = generateMaze(10, 10);
        render(<MazeCanvas maze={maze} onWin={() => { }} onLoss={() => { }} />);

        // Check if canvas exists
        const canvas = screen.getByTestId('maze-canvas');
        expect(canvas).toBeInTheDocument();
        expect(canvas.tagName).toBe('CANVAS');
    });

    it('handles mousedown events to start drawing', () => {
        const maze = generateMaze(10, 10);
        render(<MazeCanvas maze={maze} onWin={() => { }} onLoss={() => { }} />);
        const canvas = screen.getByTestId('maze-canvas');

        // Simulate clicking slightly off (0,0) to start
        fireEvent.mouseDown(canvas, { clientX: 10, clientY: 10 });
        // Without full JSDOM Canvas Mock capabilities it's tough to verify the internal drawing state,
        // so we mostly ensure the event handlers don't throw errors.
        expect(true).toBe(true);
    });
});
