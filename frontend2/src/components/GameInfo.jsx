import React from 'react';

const GameInfo = ({ isPlayer1, winner, moves, player1Name = 'Player 1', player2Name = 'Player 2' }) => {
  const getStatusText = () => {
    if (winner === 'player1') return `${player1Name} Wins!`;
    if (winner === 'player2') return `${player2Name} Wins!`;
    if (winner === 'draw') return 'Game ended in a draw!';
    return `Current Player: ${isPlayer1 ? player1Name : player2Name}`;
  };

  return (
    <div className={`status ${winner ? 'winner' : isPlayer1 ? 'player1' : 'player2'}`}>
      {getStatusText()}
      <div style={{ fontSize: '0.8rem', marginTop: '5px' }}>
        Moves: {moves}
      </div>
    </div>
  );
};

export default GameInfo;