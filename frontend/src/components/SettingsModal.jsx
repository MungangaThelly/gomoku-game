import React, { useState, useEffect } from 'react';

const defaultColors = [
  { label: 'Black', value: 'black' },
  { label: 'Red', value: 'red' },
  { label: 'Blue', value: 'blue' },
  { label: 'Green', value: 'green' },
];

const SettingsModal = ({ isOpen, onClose, playerSettings, onSave }) => {

  const [player1Name, setPlayer1Name] = useState(playerSettings.player1Name || 'Player 1');
  const [player2Name, setPlayer2Name] = useState(playerSettings.player2Name || 'Player 2');
  const [player1Color, setPlayer1Color] = useState(playerSettings.player1Color || 'black');
  const [player2Color, setPlayer2Color] = useState(playerSettings.player2Color || 'red');

  useEffect(() => {
    setPlayer1Name(playerSettings.player1Name || 'Player 1');
    setPlayer2Name(playerSettings.player2Name || 'Player 2');
    setPlayer1Color(playerSettings.player1Color || 'black');
    setPlayer2Color(playerSettings.player2Color || 'red');
  }, [playerSettings, isOpen]);

  const handleSave = () => {
    if (player1Color === player2Color) {
      alert('Players must have different colors!');
      return;
    }
    onSave({ player1Name, player2Name, player1Color, player2Color });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal settings-modal">
        <h2>Settings</h2>
        <div className="settings-group">
          <label>Player 1 Name:</label>
          <input value={player1Name} onChange={e => setPlayer1Name(e.target.value)} />
        </div>
        <div className="settings-group">
          <label>Player 1 Color:</label>
          <select value={player1Color} onChange={e => setPlayer1Color(e.target.value)}>
            {defaultColors.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <div className="settings-group">
          <label>Player 2 Name:</label>
          <input value={player2Name} onChange={e => setPlayer2Name(e.target.value)} />
        </div>
        <div className="settings-group">
          <label>Player 2 Color:</label>
          <select value={player2Color} onChange={e => setPlayer2Color(e.target.value)}>
            {defaultColors.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <div className="settings-actions">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
