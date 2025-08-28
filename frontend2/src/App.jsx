// ...existing code...
// ...existing code...
import React, { useState } from 'react';
import AuthForm from './components/AuthForm';
import MultiplayerPanel from './components/MultiplayerPanel';
import { getGame, sendMove } from './utils/api';
import { checkWinner, isBoardFull } from './utils/gameLogic';
import Board from './components/Board';
import GameInfo from './components/GameInfo';
import Controls from './components/Controls';
import SettingsModal from './components/SettingsModal';
import GameModeSelector from './components/GameModeSelector';
import TimerDisplay from './components/TimerDisplay';
import { useGomoku } from './hooks/useGomoku';
import { createEmptyBoard } from './utils/gameLogic';
import { getRandomAIMove } from './utils/ai';

const defaultPlayerSettings = {
  player1Name: 'Player 1',
  player2Name: 'Player 2',
  player1Color: 'black',
  player2Color: 'red',
};


const App = () => {
  const { board, isPlayer1, winner, moves, makeMove, resetGame, undoMove, canUndo } = useGomoku();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [playerSettings, setPlayerSettings] = useState(defaultPlayerSettings);
  const [gameMode, setGameMode] = useState('pvp');
  const [user, setUser] = useState(() => sessionStorage.getItem('gomokuUser') || null); // user state
  // Persist user to sessionStorage on login/logout
  React.useEffect(() => {
    if (user) {
      sessionStorage.setItem('gomokuUser', user);
    } else {
      sessionStorage.removeItem('gomokuUser');
    }
  }, [user]);
  const [multiplayerGameId, setMultiplayerGameId] = useState(null);
  const [multiplayerMoves, setMultiplayerMoves] = useState([]);
  const [multiplayerRole, setMultiplayerRole] = useState(null); // 'player1' or 'player2'

  // Timer state
  const [player1Time, setPlayer1Time] = useState(0);
  const [player2Time, setPlayer2Time] = useState(0);
  const [paused, setPaused] = useState(false);

  // Timer effect
  React.useEffect(() => {
    if (winner || paused) return;
    const interval = setInterval(() => {
      if (isPlayer1) setPlayer1Time(t => t + 1);
      else setPlayer2Time(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlayer1, winner, paused]);

  // Reset timer on new game
  React.useEffect(() => {
    setPlayer1Time(0);
    setPlayer2Time(0);
  }, [moves === 0]);

  // AI move effect (must be after all useState)
  React.useEffect(() => {
    if (winner || paused) return;
    if (gameMode === 'pvai' && !isPlayer1) {
      // AI is player2
      const [row, col] = getRandomAIMove(board) || [];
      if (row !== undefined && col !== undefined) {
        setTimeout(() => makeMove(row, col), 500);
      }
    } else if (gameMode === 'aivai') {
      // Both AI
      const [row, col] = getRandomAIMove(board) || [];
      if (row !== undefined && col !== undefined) {
        setTimeout(() => makeMove(row, col), 500);
      }
    }
  }, [board, isPlayer1, winner, gameMode, makeMove, paused]);

  // Hint logic
  const handleHint = () => {
    if (winner || paused) return;
    const [row, col] = getRandomAIMove(board) || [];
    if (row !== undefined && col !== undefined) {
      alert(`Try row ${row + 1}, column ${col + 1}`);
    } else {
      alert('No moves available!');
    }
  };

  // Pause/Resume
  const handlePause = () => setPaused(p => !p);

  // Restart
  const handleRestart = () => {
    resetGame();
    setPaused(false);
  };

  // Pass color info to Board/Cell if you want colored stones
  const handleSaveSettings = (settings) => {
    setPlayerSettings(settings);
  };


  // --- Multiplayer Board Construction ---
  let multiplayerBoard = null;
  let multiplayerTurn = null;
  let multiplayerWinner = null;
  let multiplayerPlayers = [];
  let multiplayerRoles = {};
  let multiplayerJoinedRoles = [];
  if (multiplayerGameId) {
    multiplayerBoard = createEmptyBoard();
    // Build player list and roles from backend game object if available
    let backendPlayers = [];
    let backendRoles = {};
    if (multiplayerMoves.length > 0 && multiplayerMoves[0].game) {
      backendPlayers = multiplayerMoves[0].game.players || [];
      backendRoles = multiplayerMoves[0].game.roles || {};
    }
    // Fallback: try to fetch from last getGame call
    if (window._lastGameObj) {
      backendPlayers = window._lastGameObj.players || backendPlayers;
      backendRoles = window._lastGameObj.roles || backendRoles;
    }
    // Build playerNames from moves
    const playerNames = {};
    for (let i = 0; i < multiplayerMoves.length; i++) {
      const move = multiplayerMoves[i];
      if (!move) continue;
      const { row, col, player, username } = typeof move === 'object' ? move : { ...move };
      if (row == null || col == null) continue;
      multiplayerBoard[row][col] = player;
      if (player && username) playerNames[player] = username;
    }
    // Use backendPlayers/roles if available, else fallback to moves
    if (backendPlayers.length > 0 && Object.keys(backendRoles).length > 0) {
      multiplayerPlayers = backendPlayers.map((uname, idx) => {
        const role = backendRoles[uname] || `player${idx+1}`;
        return { role, username: uname };
      });
      multiplayerJoinedRoles = multiplayerPlayers.map(p => p.role);
    } else {
      // fallback: use up to 5 players from moves
      for (let i = 1; i <= 5; i++) {
        const role = `player${i}`;
        if (playerNames[role]) {
          multiplayerPlayers.push({ role, username: playerNames[role] });
        }
      }
      multiplayerJoinedRoles = multiplayerPlayers.map(p => p.role);
    }
    // Turn logic: cycle through all joined players
    const turnIndex = multiplayerMoves.length % multiplayerJoinedRoles.length;
    multiplayerTurn = multiplayerJoinedRoles[turnIndex] || 'player1';

    // Winner detection for multiplayer
    if (multiplayerMoves.length > 0) {
      const lastMove = multiplayerMoves[multiplayerMoves.length - 1];
      if (lastMove && lastMove.row != null && lastMove.col != null && lastMove.player) {
        if (checkWinner(multiplayerBoard, lastMove.row, lastMove.col, lastMove.player)) {
          multiplayerWinner = lastMove.player;
        } else if (isBoardFull(multiplayerBoard)) {
          multiplayerWinner = 'draw';
        }
      }
    }
  }

  // Multiplayer move handler
  const [mpMoveError, setMpMoveError] = useState('');
  const handleMultiplayerMove = async (row, col) => {
    setMpMoveError('');
    if (!multiplayerGameId || !multiplayerRole) {
      setMpMoveError('No game or role.');
      console.log('No game or role.');
      return;
    }
    if (multiplayerBoard[row][col]) {
      setMpMoveError('Cell is already occupied.');
      console.log('Cell is already occupied.');
      return;
    }
    if (multiplayerTurn !== multiplayerRole) {
      setMpMoveError(`It is not your turn. You are ${multiplayerRole}, current turn: ${multiplayerTurn}`);
      console.log(`It is not your turn. You are ${multiplayerRole}, current turn: ${multiplayerTurn}`);
      return;
    }
    console.log(`Sending move: row=${row}, col=${col}, player=${multiplayerRole}`);
  await sendMove(multiplayerGameId, { row, col, player: multiplayerRole, username: user });
  // Immediately fetch latest moves to update turn
  const res = await getGame(multiplayerGameId);
  if (res && res.moves) setMultiplayerMoves(res.moves);
  };


  // Multiplayer polling effect (must be inside App to access state)
  React.useEffect(() => {
    let interval = null;
    if (multiplayerGameId && user) {
      interval = setInterval(async () => {
        const res = await getGame(multiplayerGameId + '?t=' + Date.now());
        if (res && res.moves) {
          setMultiplayerMoves(res.moves);
          // Store the latest game object globally for player/role info
          window._lastGameObj = res;
        }
      }, 1000); // Poll every 1 second
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [multiplayerGameId, user]);

  // Automatically reset multiplayer game after win/draw
  React.useEffect(() => {
    if (multiplayerGameId && multiplayerWinner) {
      const timeout = setTimeout(async () => {
        // Clear moves in backend as well
        await fetch(`/api/game/move`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gameId: multiplayerGameId, move: '__reset__' })
        });
        setMultiplayerMoves([]);
        setMultiplayerGameId(null);
        setMultiplayerRole(null);
      }, 4000); // 4 seconds
      return () => clearTimeout(timeout);
    }
  }, [multiplayerWinner, multiplayerGameId]);

  return (
    <div className="container">
      <header>
        <h1>Gomoku Game</h1>
        <p className="subtitle">Five in a Row - Built with React + Vite</p>
        {user && (
          <div style={{ float: 'right', fontSize: 14 }}>
            Logged in as <b>{user}</b>
            <button style={{ marginLeft: 12 }} onClick={() => { setUser(null); setMultiplayerGameId(null); }}>
              Logout
            </button>
          </div>
        )}
      </header>

      {!user ? (
        <AuthForm onAuth={setUser} />
      ) : (
        <>
          <GameModeSelector mode={gameMode} onChange={setGameMode} />

          {/* Multiplayer Panel */}
          <MultiplayerPanel user={user} onGameJoined={async (gameId, role) => {
            setMultiplayerGameId(gameId);
            setMultiplayerRole(role);
            // Fetch latest moves and game object after joining
            const res = await getGame(gameId);
            if (res && res.moves) setMultiplayerMoves(res.moves);
            if (res) window._lastGameObj = res;
          }} />
          {multiplayerGameId && (
            <div style={{ margin: '12px 0', color: 'green' }}>
              Multiplayer Game Code: <b>{multiplayerGameId}</b> | You are <b>{multiplayerRole}</b>
              <div style={{ color: 'blue', marginTop: 4 }}>
                <b>Current turn:</b> {multiplayerTurn}
              </div>
              <div style={{ color: 'purple', marginTop: 4, fontSize: 14 }}>
                <b>Players:</b> {multiplayerPlayers.filter(p => p.username !== p.role).map(p => `${p.username} (${p.role})`).join(', ')}
              </div>
              <div style={{ color: 'gray', marginTop: 4, fontSize: 12 }}>
                <b>Moves:</b> {JSON.stringify(multiplayerMoves)}
              </div>
              <button style={{ marginTop: 8 }} onClick={async () => {
                const res = await getGame(multiplayerGameId);
                if (res && res.moves) setMultiplayerMoves(res.moves);
              }}>
                Refresh Game State
              </button>
            </div>
          )}

          <div className="game-container">
            <GameInfo isPlayer1={isPlayer1} winner={multiplayerGameId ? multiplayerWinner : winner} moves={multiplayerGameId ? multiplayerMoves.length : moves}
              player1Name={multiplayerGameId ? (multiplayerPlayers[0]?.username || 'Player 1') : playerSettings.player1Name}
              player2Name={multiplayerGameId ? (multiplayerPlayers[1]?.username || 'Player 2') : playerSettings.player2Name}
            />
            <Board
              board={multiplayerGameId ? multiplayerBoard : board}
              onCellClick={multiplayerGameId ? (multiplayerWinner ? () => {} : handleMultiplayerMove) : makeMove}
              player1Color={playerSettings.player1Color}
              player2Color={playerSettings.player2Color}
            />
            {multiplayerGameId && mpMoveError && (
              <div style={{ color: 'red', marginTop: 8 }}>{mpMoveError}</div>
            )}
            <Controls
              onReset={resetGame}
              onUndo={undoMove}
              canUndo={canUndo}
              onSettings={() => setSettingsOpen(true)}
              onHint={handleHint}
              onPause={handlePause}
              paused={paused}
              onRestart={handleRestart}
            />
          <TimerDisplay
            player1Time={player1Time}
            player2Time={player2Time}
            isPlayer1={isPlayer1}
            paused={paused}
          />
          </div>

          <SettingsModal
            isOpen={settingsOpen}
            onClose={() => setSettingsOpen(false)}
            playerSettings={playerSettings}
            onSave={handleSaveSettings}
          />
        </>
      )}

      <div className="instructions">
        <h3>How to Play Gomoku</h3>
        <p>
          Gomoku, also known as Five in a Row, is a strategy board game. 
          Players alternate turns placing a stone of their color on an empty intersection. 
          The winner is the first player to form an unbroken chain of five stones horizontally, 
          vertically, or diagonally.
        </p>
      </div>

    </div>
  );
}

export default App;