import React from 'react';
import Cell from './Cell';

const Board = ({ board, onCellClick, player1Color = 'black', player2Color = 'red' }) => {
  return (
    <div className="board">
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            value={cell}
            onClick={() => onCellClick(rowIndex, colIndex)}
            player1Color={player1Color}
            player2Color={player2Color}
          />
        ))
      )}
    </div>
  );
};

export default Board;