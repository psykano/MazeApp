import React from 'react';
import { render, screen, act } from '@testing-library/react';
import TimerBar from './TimerBar';

describe('TimerBar', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders initial time limit', () => {
        render(<TimerBar timeLimit={60} onTimeOut={() => { }} />);
        expect(screen.getByTestId('timer-bar')).toBeInTheDocument();
    });

    it('calls onTimeOut when time reaches 0', () => {
        const handleTimeout = vi.fn();
        render(<TimerBar timeLimit={2} onTimeOut={handleTimeout} />);

        expect(handleTimeout).not.toHaveBeenCalled();

        // Fast forward 2 seconds step-by-step
        act(() => {
            vi.advanceTimersByTime(1000);
        });
        act(() => {
            vi.advanceTimersByTime(1000);
        });

        expect(handleTimeout).toHaveBeenCalledTimes(1);
    });
});
