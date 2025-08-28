# Gomoku Game Frontend (frontend2)

This is the React frontend for the extended Gomoku game supporting up to 5 players.

## Features
- Play Gomoku (Five in a Row) in multiplayer mode (up to 5 players)
- User authentication (register/login)
- Real-time multiplayer board and turn management
- Game timer, move history, and winner detection
- Responsive UI built with Vite + React

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm

### Installation
1. Navigate to the `frontend2` directory:
	```bash
	cd frontend2
	```
2. Install dependencies:
	```bash
	npm install
	```

### Running the App
Start the development server:
```bash
npm run dev
```
The app will be available at `http://localhost:5173` (or as indicated in the terminal).

### Usage
- Register or log in with a username and password.
- Create or join a multiplayer game using a game code.
- Play turns as your assigned player (up to 5 players per game).

### Project Structure
- `src/` - React source code
  - `components/` - UI components (Board, Cell, Controls, etc.)
  - `hooks/` - Custom React hooks
  - `utils/` - Game logic and API helpers

### Environment
- By default, the frontend expects the backend to run on `http://localhost:3000`.
- You can change the API base URL in `src/utils/api.js` if needed.

---
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
