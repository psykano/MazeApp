import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from './ThemeProvider';

// A mock component to test the theme context
const MockConsumer = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <div>
            <span data-testid="theme-display">{theme}</span>
            <button onClick={toggleTheme}>Toggle</button>
        </div>
    );
};

describe('ThemeProvider', () => {
    it('provides the default dark theme', () => {
        render(
            <ThemeProvider>
                <MockConsumer />
            </ThemeProvider>
        );
        expect(screen.getByTestId('theme-display')).toHaveTextContent('dark');
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('toggles theme to light when toggleTheme is called', () => {
        render(
            <ThemeProvider>
                <MockConsumer />
            </ThemeProvider>
        );
        const button = screen.getByText('Toggle');
        fireEvent.click(button);
        expect(screen.getByTestId('theme-display')).toHaveTextContent('light');
        expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });
});
