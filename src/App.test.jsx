import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import React from 'react';

describe('App', () => {
    it('renders the configuration menu initially', () => {
        render(<App />);
        expect(screen.getByText(/Maze Configuration/i)).toBeInTheDocument();
    });

    it('transitions to playing state when start is clicked', () => {
        render(<App />);
        fireEvent.click(screen.getByText('Start Game'));
        expect(screen.getByTestId('maze-canvas')).toBeInTheDocument();
    });
});
