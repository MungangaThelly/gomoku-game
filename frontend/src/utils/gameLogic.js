// Game logic utilities
export const checkWinner = (board, row, col, player) => {
  // Check horizontal
  if (checkDirection(board, row, col, 0, 1, player) + 
      checkDirection(board, row, col, 0, -1, player) >= 4) {
    return true;
  }

  // Check vertical
  if (checkDirection(board, row, col, 1, 0, player) + 
      checkDirection(board, row, col, -1, 0, player) >= 4) {
    return true;
  }

  // Check diagonal down-right
  if (checkDirection(board, row, col, 1, 1, player) + 
      checkDirection(board, row, col, -1, -1, player) >= 4) {
    return true;
  }

  // Check diagonal up-right
  if (checkDirection(board, row, col, -1, 1, player) + 
      checkDirection(board, row, col, 1, -1, player) >= 4) {
    return true;
  }

  return false;
};

const checkDirection = (board, row, col, rowDir, colDir, player) => {
  let count = 0;
  let r = row + rowDir;
  let c = col + colDir;

  while (
    r >= 0 && r < 15 && 
    c >= 0 && c < 15 && 
    board[r][c] === player
  ) {
    count++;
    r += rowDir;
    c += colDir;
  }

  return count;
};

export const isBoardFull = (board) => {
  return board.every(row => row.every(cell => cell !== null));
};

export const createEmptyBoard = () => {
  return Array(15).fill().map(() => Array(15).fill(null));
};