import React, { useState } from 'react';
import './ConfigMenu.css';

export const calculateTimeLimit = (width, height, difficulty) => {
    const area = width * height;
    switch (difficulty) {
        case 'Easy': return Math.floor(area / 2);
        case 'Hard': return Math.floor(area / 6);
        case 'Normal':
        case 'Custom':
        default:
            return Math.floor(area / 4);
    }
};

const PRESETS = {
    Easy: { width: 10, height: 10, density: 0.2 },
    Normal: { width: 20, height: 20, density: 0.5 },
    Hard: { width: 40, height: 40, density: 0.8 },
};

const ConfigMenu = ({ onStart }) => {
    const [difficulty, setDifficulty] = useState('Normal');
    const [customConfig, setCustomConfig] = useState(PRESETS.Normal);

    const handleDifficultyChange = (level) => {
        setDifficulty(level);
        if (level !== 'Custom') {
            setCustomConfig(PRESETS[level]);
        }
    };

    const handleCustomChange = (e) => {
        const { name, value } = e.target;
        setCustomConfig(prev => ({ ...prev, [name]: parseFloat(value) }));
    };

    const handleStart = () => {
        const config = {
            ...customConfig,
            timeLimit: calculateTimeLimit(customConfig.width, customConfig.height, difficulty)
        };
        onStart(config);
    };

    const timeEst = calculateTimeLimit(customConfig.width, customConfig.height, difficulty);

    return (
        <div className="config-menu">
            <h2>Maze Configuration</h2>

            <div className="difficulty-presets">
                {['Easy', 'Normal', 'Hard', 'Custom'].map(level => (
                    <button
                        key={level}
                        className={`preset-btn ${difficulty === level ? 'active' : ''}`}
                        onClick={() => handleDifficultyChange(level)}
                    >
                        {level}
                    </button>
                ))}
            </div>

            <div className="config-summary">
                <p>Dimensions: {customConfig.width}x{customConfig.height}</p>
                <p>Dead-ends: {Math.round(customConfig.density * 100)}%</p>
                <p className="time-limit">Time Limit: {timeEst}s</p>
            </div>

            {difficulty === 'Custom' && (
                <div className="custom-sliders">
                    <label>
                        Width: {customConfig.width}
                        <input type="range" name="width" min="5" max="50" value={customConfig.width} onChange={handleCustomChange} />
                    </label>
                    <label>
                        Height: {customConfig.height}
                        <input type="range" name="height" min="5" max="50" value={customConfig.height} onChange={handleCustomChange} />
                    </label>
                    <label>
                        Dead-ends density: {customConfig.density}
                        <input type="range" name="density" min="0" max="1" step="0.1" value={customConfig.density} onChange={handleCustomChange} />
                    </label>
                </div>
            )}

            <button className="start-btn" onClick={handleStart}>Start Game</button>
        </div>
    );
};

export default ConfigMenu;
