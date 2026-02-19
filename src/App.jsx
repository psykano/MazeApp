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
            <header className="app-header">
                <button onClick={toggleTheme}>Toggle Theme</button>
            </header>

            {gameState === 'config' && (
                <div className="menu-container">
                    <ConfigMenu onStart={startGame} />
                </div>
            )}

            {gameState === 'playing' && maze && (
                <>
                    <TimerBar timeLimit={config.timeLimit} onTimeOut={() => handleLoss('Time Out')} />
                    <MazeCanvas maze={maze} onWin={handleWin} onLoss={handleLoss} />
                </>
            )}

            {gameState === 'win' && (
                <div className="menu-container">
                    <h2>You Win!</h2>
                    <button onClick={() => setGameState('config')}>Play Again</button>
                </div>
            )}

            {gameState === 'loss' && (
                <div className="menu-container">
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
