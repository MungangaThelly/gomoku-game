import React from 'react';

const Controls = ({ onReset, onUndo, canUndo, onSettings, onHint, onPause, paused, onRestart }) => {
  return (
    <div className="controls">
      <button onClick={onReset} className="reset">New Game</button>
      <button onClick={onRestart}>Restart</button>
      <button onClick={onUndo} disabled={!canUndo}>Undo Move</button>
      <button onClick={onHint}>Hint</button>
      <button onClick={onPause}>{paused ? 'Resume' : 'Pause'}</button>
      <button onClick={onSettings}>Settings</button>
    </div>
  );
};

export default Controls;