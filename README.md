# Gomoku Multiplayer Game

A full-stack Gomoku (Five in a Row) game with React frontend and Node.js/Express + MongoDB backend. Supports multiplayer with real-time polling, user authentication, persistent scores, and game state.

## Features
- Play Gomoku (Five in a Row) against another player, AI, or yourself
- Multiplayer mode with unique game codes for remote play
- User registration and login
- Persistent scores and game state using MongoDB
- Automatic winner detection and game reset
- Responsive UI with timer, undo, and settings

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm
- MongoDB (local or Atlas)

### Installation
1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd gomoku-game
   ```
2. Install backend dependencies:
   ```bash
   cd server
   npm install
   ```
3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```
4. Set up environment variables:
   - Edit `server/.env` with your MongoDB URI and DB name (see sample in the file).

### Running the App
1. Start the backend server:
   ```bash
   cd server
   npm start
   # or for auto-reload during development:
   npx nodemon server.js
   ```
2. Start the frontend:
   ```bash
   cd ../frontend
   npm run dev
   ```
3. Open your browser to `http://localhost:5173` (or the port shown in the terminal).

## Multiplayer Instructions
- Click "Create Game" to generate a unique game code.
- Share the code with your friend (remote or local).
- The other player enters the code in "Enter Game Code" and clicks "Join Game".
- Both players must be logged in with different usernames.

## Project Structure
```
frontend/
  src/
    components/      # React UI components
    hooks/           # Custom React hooks
    utils/           # Game logic, API helpers
  ...
server/
  server.js          # Express backend
  mongo.js           # MongoDB connection
  .env               # Backend environment variables
```

## Customization
- To change board size, edit `createEmptyBoard` in `frontend/src/utils/gameLogic.js`.
- To add more features (chat, spectators, etc.), extend the backend and frontend as needed.

## License
MIT
