import React, { useEffect, useState } from 'react';
import './TimerBar.css';

const TimerBar = ({ timeLimit, onTimeOut }) => {
    const [timeLeft, setTimeLeft] = useState(timeLimit);

    useEffect(() => {
        if (timeLeft <= 0) {
            onTimeOut();
            return;
        }

        // Ticking audio hook when time logic is <= 5 seconds
        if (timeLeft <= 5 && timeLeft > 0) {
            try {
                // We use a short synthesized beep to avoid needing external MP3 files
                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                oscillator.type = 'square';
                oscillator.frequency.value = 800;
                gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
                oscillator.start();
                gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.1);
                oscillator.stop(audioCtx.currentTime + 0.1);
            } catch (e) {
                // Ignore audio errors in test environments or if browser blocks autoplay
            }
        }

        const timer = setTimeout(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [timeLeft, onTimeOut]);

    // Calculate percentage to fill the bar
    const progressPercent = Math.max(0, (timeLeft / timeLimit) * 100);

    // Color shifts to red when time is low
    const isCritical = timeLeft <= 10;

    return (
        <div className="timer-container" data-testid="timer-bar">
            <div
                className={`timer-fill ${isCritical ? 'critical' : ''}`}
                style={{ width: `${progressPercent}%` }}
            ></div>
            <div className="timer-text">
                {timeLeft}s
            </div>
        </div>
    );
};

export default TimerBar;
