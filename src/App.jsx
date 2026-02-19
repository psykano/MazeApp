import React, { useState } from 'react';
import { ThemeProvider, useTheme } from './components/ThemeProvider';
import ConfigMenu from './components/ConfigMenu';
import MazeCanvas from './components/MazeCanvas';
import TimerBar from './components/TimerBar';
import { generateMaze } from './utils/mazeEngine';

function MazeApp() {
    const { toggleTheme } = useTheme();
    const [gameState, setGameState] = useState('config'); // config, playing, win, loss
    const [config, setConfig] = useState(null);
    const [maze, setMaze] = useState(null);
    const [lossReason, setLossReason] = useState('');

    const startGame = (mazeConfig) => {
        setConfig(mazeConfig);
        const newMaze = generateMaze(mazeConfig.width, mazeConfig.height, mazeConfig.density);
        setMaze(newMaze);
        setGameState('playing');
    };

    const handleWin = () => {
        setGameState('win');
    };

    const handleLoss = (reason) => {
        setLossReason(reason);
        setGameState('loss');
    };

    return (
        <div className="app-container">
            <header style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem', width: '100vw', position: 'absolute', top: 0, boxSizing: 'border-box' }}>
                <button onClick={toggleTheme}>Toggle Theme</button>
            </header>

            {gameState === 'config' && (
                <ConfigMenu onStart={startGame} />
            )}

            {gameState === 'playing' && maze && (
                <>
                    <TimerBar timeLimit={config.timeLimit} onTimeOut={() => handleLoss('Time Out')} />
                    <MazeCanvas maze={maze} onWin={handleWin} onLoss={handleLoss} />
                </>
            )}

            {gameState === 'win' && (
                <div style={{ zIndex: 10, textAlign: 'center' }}>
                    <h2>You Win!</h2>
                    <button onClick={() => setGameState('config')}>Play Again</button>
                </div>
            )}

            {gameState === 'loss' && (
                <div style={{ zIndex: 10, textAlign: 'center' }}>
                    <h2>Game Over</h2>
                    <p>{lossReason}</p>
                    <button onClick={() => setGameState('config')}>Try Again</button>
                </div>
            )}
        </div>
    );
}

function App() {
    return (
        <ThemeProvider>
            <MazeApp />
        </ThemeProvider>
    );
}

export default App;
