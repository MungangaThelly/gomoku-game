import React, { useState } from 'react';
import Board from './Board';

export default {
  title: 'Game/Board',
  component: Board,
  argTypes: {
    player1Color: { control: 'color' },
    player2Color: { control: 'color' },
    onCellClick: { action: 'cell clicked' },
  },
};

const emptyBoard = (size = 15) =>
  Array.from({ length: size }, () => Array(size).fill(null));

const clone = (b) => b.map(r => [...r]);

const Template = (args) => <Board {...args} />;

export const Empty = Template.bind({});
Empty.args = {
  board: emptyBoard(),
};

export const FewMoves = Template.bind({});
FewMoves.args = {
  board: (() => {
    const b = emptyBoard();
    b[7][7] = 'player1';
    b[7][8] = 'player2';
    b[8][8] = 'player1';
    return b;
  })(),
};

export const NearWinHorizontal = Template.bind({});
NearWinHorizontal.args = {
  board: (() => {
    const b = emptyBoard();
    for (let i = 3; i < 7; i++) b[5][i] = 'player1';
    b[5][7] = 'player2';
    return b;
  })(),
};

export const NearWinDiagonal = Template.bind({});
NearWinDiagonal.args = {
  board: (() => {
    const b = emptyBoard();
    for (let i = 0; i < 4; i++) b[4 + i][4 + i] = 'player2';
    b[3][3] = 'player1';
    b[8][8] = 'player1';
    return b;
  })(),
};

export const CustomColors = Template.bind({});
CustomColors.args = {
  board: (() => {
    const b = emptyBoard();
    b[7][7] = 'player1';
    b[6][7] = 'player2';
    return b;
  })(),
  player1Color: '#0d47a1',
  player2Color: '#d32f2f',
};

export const AlmostFull = Template.bind({});
AlmostFull.args = {
  board: (() => {
    const b = emptyBoard(10);
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        if ((r + c) % 5 === 0) continue;
        b[r][c] = (r + c) % 2 === 0 ? 'player1' : 'player2';
      }
    }
    return b;
  })(),
};

export const InteractiveLocalState = (args) => {
  const [board, setBoard] = useState(emptyBoard());
  const [turn, setTurn] = useState('player1');

  const handleClick = (r, c) => {
    if (board[r][c]) return;
    const next = clone(board);
    next[r][c] = turn;
    setBoard(next);
    setTurn(turn === 'player1' ? 'player2' : 'player1');
  };

  return (
    <div>
      <p>Turn: {turn}</p>
      <Board
        {...args}
        board={board}
        onCellClick={handleClick}
      />
      <button onClick={() => { setBoard(emptyBoard()); setTurn('player1'); }}>
        Reset
      </button>
    </div>
  );
};
InteractiveLocalState.args = {
  player1Color: 'black',
  player2Color: 'red',
};