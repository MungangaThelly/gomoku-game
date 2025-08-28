// Returns a random empty cell as [row, col] or null if full
export function getRandomAIMove(board) {
  const empty = [];
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (!board[r][c]) empty.push([r, c]);
    }
  }
  if (empty.length === 0) return null;
  return empty[Math.floor(Math.random() * empty.length)];
}
