# Gomoku Game Backend (server2)

This is the Express.js backend for the extended Gomoku game supporting up to 5 players.

## Features
- REST API for multiplayer Gomoku (up to 5 players per game)
- User authentication (register/login)
- Persistent user scores and game state (MongoDB)
- Endpoints for creating, joining, and playing games
- Endpoint to list all users (`/api/users`)

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm
- MongoDB (local or cloud instance)

### Installation
1. Navigate to the `server2` directory:
   ```bash
   cd server2
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration
- Set your MongoDB connection string in `mongo.js` or as an environment variable if required.

### Running the Server
Start the backend server:
```bash
node server.js
```
Or with nodemon for auto-reload:
```bash
npx nodemon server.js
```
The server will run on `http://localhost:3000` by default.

### API Endpoints
- `POST /api/register` - Register a new user
- `POST /api/login` - Login
- `POST /api/score` - Save a user score
- `GET /api/scores/:username` - Get user scores
- `POST /api/game/create` - Create a new game
- `POST /api/game/join` - Join an existing game
- `POST /api/game/move` - Make a move in a game
- `GET /api/game/:gameId` - Get game state
- `GET /api/users` - List all users

### Database
- Uses a `users` collection for user data
- Uses a `games` collection for game state

---
