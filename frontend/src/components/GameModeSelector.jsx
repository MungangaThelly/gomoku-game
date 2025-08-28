import React from 'react';

const GAME_MODES = [
  { label: 'Player vs Player', value: 'pvp' },
  { label: 'Player vs AI', value: 'pvai' },
  { label: 'AI vs AI', value: 'aivai' },
];

const GameModeSelector = ({ mode, onChange }) => {
  return (
    <div className="game-mode-selector">
      {GAME_MODES.map(m => (
        <button
          key={m.value}
          className={`game-mode-btn${mode === m.value ? ' active' : ''}`}
          onClick={() => onChange(m.value)}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
};

export default GameModeSelector;
