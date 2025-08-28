import React from 'react';

const Cell = ({ value, onClick, isWinning, player1Color = 'black', player2Color = 'red' }) => {
  let stoneStyle = {};
  if (value === 'player1') stoneStyle.background = player1Color;
  if (value === 'player2') stoneStyle.background = player2Color;
  return (
    <div 
      className="cell" 
      onClick={onClick}
      style={isWinning ? { backgroundColor: 'rgba(46, 204, 113, 0.3)' } : {}}
    >
      {value && <div className={`stone ${value}`} style={stoneStyle} />}
    </div>
  );
};

export default Cell;