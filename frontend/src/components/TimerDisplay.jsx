import React from 'react';

const TimerDisplay = ({ player1Time, player2Time, isPlayer1, paused }) => {
  const format = (t) => {
    const m = Math.floor(t / 60).toString().padStart(2, '0');
    const s = (t % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };
  return (
    <div className="timer-display">
      <span className={isPlayer1 ? 'active' : ''}>P1: {format(player1Time)}</span>
      <span className={!isPlayer1 ? 'active' : ''}>P2: {format(player2Time)}</span>
      {paused && <span className="paused">Paused</span>}
    </div>
  );
};

export default TimerDisplay;
