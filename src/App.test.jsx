import { render, screen } from '@testing-library/react';
import App from './App';
import React from 'react';

describe('App', () => {
    it('renders headline', () => {
        render(<App />);
        const headline = screen.getByText(/2D Maze Application/i);
        expect(headline).toBeInTheDocument();
    });
});
