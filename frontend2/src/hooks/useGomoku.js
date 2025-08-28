import { useState, useCallback } from 'react';
import { checkWinner, isBoardFull, createEmptyBoard } from '../utils/gameLogic';

export const useGomoku = () => {
  const [board, setBoard] = useState(createEmptyBoard());
  const [isPlayer1, setIsPlayer1] = useState(true);
  const [winner, setWinner] = useState(null);
  const [moves, setMoves] = useState(0);
  const [gameHistory, setGameHistory] = useState([]);

  const makeMove = useCallback((row, col) => {
    if (board[row][col] || winner) return false;

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = isPlayer1 ? 'player1' : 'player2';
    
    // Save current state to history
    setGameHistory(prev => [...prev, { 
      board: board.map(row => [...row]), 
      isPlayer1, 
      moves 
    }]);
    
    setBoard(newBoard);
    
    // Check for winner
    if (checkWinner(newBoard, row, col, isPlayer1 ? 'player1' : 'player2')) {
      setWinner(isPlayer1 ? 'player1' : 'player2');
    } else if (isBoardFull(newBoard)) {
      setWinner('draw');
    } else {
      setIsPlayer1(!isPlayer1);
    }
    
    setMoves(moves + 1);
    return true;
  }, [board, isPlayer1, winner, moves]);

  const resetGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setIsPlayer1(true);
    setWinner(null);
    setMoves(0);
    setGameHistory([]);
  }, []);

  const undoMove = useCallback(() => {
    if (gameHistory.length === 0) return;
    
    const lastState = gameHistory[gameHistory.length - 1];
    setBoard(lastState.board);
    setIsPlayer1(lastState.isPlayer1);
    setMoves(lastState.moves);
    setWinner(null);
    
    setGameHistory(prev => prev.slice(0, -1));
  }, [gameHistory]);

  return {
    board,
    isPlayer1,
    winner,
    moves,
    makeMove,
    resetGame,
    undoMove,
    canUndo: gameHistory.length > 0
  };
};