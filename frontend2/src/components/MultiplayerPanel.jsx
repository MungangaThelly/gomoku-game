import React, { useState } from 'react';
import { createGame, joinGame } from '../utils/api';

const MultiplayerPanel = ({ user, onGameJoined }) => {
  const [gameId, setGameId] = useState('');
  const [createdGameId, setCreatedGameId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await createGame(user);
      if (res.gameId) {
        setCreatedGameId(res.gameId);
        onGameJoined(res.gameId, res.role || 'player1');
      } else {
        setError(res.error || 'Failed to create game');
      }
    } catch (e) {
      setError('Server error');
    }
    setLoading(false);
  };

  const handleJoin = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await joinGame(user, gameId);
      if (res.game && res.role) {
        onGameJoined(gameId, res.role);
      } else {
        setError(res.error || 'Failed to join game');
      }
    } catch (e) {
      setError('Server error');
    }
    setLoading(false);
  };

  return (
    <div className="multiplayer-panel">
      <h3>Multiplayer</h3>
      <button onClick={handleCreate} disabled={loading}>
        {loading ? 'Creating...' : 'Create Game'}
      </button>
      {createdGameId && (
        <div style={{ marginTop: 8 }}>
          Game created! Share this code: <b>{createdGameId}</b>
        </div>
      )}
      <div style={{ marginTop: 16 }}>
        <input
          type="text"
          placeholder="Enter Game Code"
          value={gameId}
          onChange={e => setGameId(e.target.value)}
        />
        <button onClick={handleJoin} disabled={loading || !gameId} style={{ marginLeft: 8 }}>
          {loading ? 'Joining...' : 'Join Game'}
        </button>
      </div>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
};

export default MultiplayerPanel;
