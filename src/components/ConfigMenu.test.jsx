import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ConfigMenu, { calculateTimeLimit } from './ConfigMenu';

describe('ConfigMenu', () => {
    it('renders difficulty presets', () => {
        render(<ConfigMenu onStart={() => { }} />);
        expect(screen.getByText('Easy')).toBeInTheDocument();
        expect(screen.getByText('Normal')).toBeInTheDocument();
        expect(screen.getByText('Hard')).toBeInTheDocument();
        expect(screen.getByText('Custom')).toBeInTheDocument();
    });

    it('shows custom sliders only when custom mode is selected', () => {
        render(<ConfigMenu onStart={() => { }} />);

        // Custom sliders should not be visible initially (defaults to Normal)
        expect(screen.queryByLabelText(/Width:/)).not.toBeInTheDocument();

        // Click Custom
        fireEvent.click(screen.getByText('Custom'));

        // Sliders should now be visible
        expect(screen.getByLabelText(/Width:/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Height:/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Dead-ends density/)).toBeInTheDocument();
    });

    it('calls onStart with correct configuration when Start Game is clicked', () => {
        const handleStart = vi.fn();
        render(<ConfigMenu onStart={handleStart} />);

        // Click Easy
        fireEvent.click(screen.getByText('Easy'));

        // Start game
        fireEvent.click(screen.getByText('Start Game'));

        expect(handleStart).toHaveBeenCalledWith({
            width: 10,
            height: 10,
            density: 0.2,
            timeLimit: calculateTimeLimit(10, 10, 'Easy')
        });
    });

    describe('calculateTimeLimit', () => {
        it('calculates generous time for Easy: (W * H) / 2', () => {
            expect(calculateTimeLimit(10, 10, 'Easy')).toBe(50);
        });

        it('calculates moderate time for Normal: (W * H) / 4', () => {
            expect(calculateTimeLimit(20, 20, 'Normal')).toBe(100);
        });

        it('calculates strict time for Hard: (W * H) / 6', () => {
            expect(calculateTimeLimit(30, 30, 'Hard')).toBe(150);
        });

        it('calculates custom time the same as Normal', () => {
            expect(calculateTimeLimit(15, 15, 'Custom')).toBe(Math.floor(225 / 4));
        });
    });
});
