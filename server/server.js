const express = require('express');
const path = require('path');
const { connectMongo } = require('./mongo');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());
// Connect to MongoDB at server startup
connectMongo().catch(err => {
  console.error('Failed to connect to MongoDB at startup:', err);
  process.exit(1);
});

// --- DB Status Endpoint ---
app.get('/api/db-status', async (req, res) => {
  try {
    const db = await connectMongo();
    // Try a simple command to check connection
    await db.command({ ping: 1 });
    res.json({ status: 'ok', message: 'Connected to MongoDB' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'MongoDB connection failed', error: err.message });
  }
});

// --- User Authentication ---
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
  const db = await connectMongo();
  const users = db.collection('users');
  const existing = await users.findOne({ username });
  if (existing) return res.status(409).json({ error: 'User already exists' });
  await users.insertOne({ username, password, scores: [] });
  res.json({ message: 'User registered' });
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const db = await connectMongo();
  const users = db.collection('users');
  const user = await users.findOne({ username });
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.json({ message: 'Login successful' });
});

// --- Scores ---
app.post('/api/score', async (req, res) => {
  const { username, score } = req.body;
  const db = await connectMongo();
  const users = db.collection('users');
  const user = await users.findOne({ username });
  if (!user) return res.status(404).json({ error: 'User not found' });
  await users.updateOne({ username }, { $push: { scores: score } });
  res.json({ message: 'Score saved' });
});

app.get('/api/scores/:username', async (req, res) => {
  const { username } = req.params;
  const db = await connectMongo();
  const users = db.collection('users');
  const user = await users.findOne({ username });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ scores: user.scores || [] });
});

// --- Multiplayer (MongoDB) ---
app.post('/api/game/create', async (req, res) => {
  const { username } = req.body;
  const db = await connectMongo();
  const users = db.collection('users');
  const user = await users.findOne({ username });
  if (!user) return res.status(404).json({ error: 'User not found' });
  const games = db.collection('games');
  const gameId = uuidv4();
  await games.insertOne({
    gameId,
    players: [username],
    roles: { [username]: 'player1' },
    moves: [],
    status: 'waiting'
  });
  res.json({ gameId, role: 'player1' });
});

app.post('/api/game/join', async (req, res) => {
  const { username, gameId } = req.body;
  const db = await connectMongo();
  const users = db.collection('users');
  const user = await users.findOne({ username });
  if (!user) return res.status(404).json({ error: 'User not found' });
  const games = db.collection('games');
  const game = await games.findOne({ gameId });
  if (!game) return res.status(404).json({ error: 'Game not found' });
  if (game.players.length >= 2) return res.status(400).json({ error: 'Game full' });
  await games.updateOne({ gameId }, {
    $push: { players: username },
    $set: { [`roles.${username}`]: 'player2', status: 'active' }
  });
  const updated = await games.findOne({ gameId });
  res.json({ message: 'Joined game', game: updated, role: 'player2' });
});

app.post('/api/game/move', async (req, res) => {
  const { gameId, move } = req.body;
  // console.log(`[API] /api/game/move called for gameId=${gameId}, move=`, move);
  const db = await connectMongo();
  const games = db.collection('games');
  const game = await games.findOne({ gameId });
  if (!game) {
    // console.log(`[API] Game not found for gameId=${gameId}`);
    return res.status(404).json({ error: 'Game not found' });
  }
  if (move === '__reset__') {
    await games.updateOne({ gameId }, { $set: { moves: [] } });
    const updated = await games.findOne({ gameId });
    return res.json({ message: 'Game reset', moves: updated.moves });
  }
  await games.updateOne({ gameId }, { $push: { moves: move } });
  const updated = await games.findOne({ gameId });
  // console.log(`[API] Move recorded. Updated moves:`, updated.moves);
  res.json({ message: 'Move recorded', moves: updated.moves });
});

app.get('/api/game/:gameId', async (req, res) => {
  const { gameId } = req.params;
  // console.log(`[API] /api/game/:gameId called for gameId=${gameId}`);
  const db = await connectMongo();
  const games = db.collection('games');
  const game = await games.findOne({ gameId });
  if (!game) {
     // console.log(`[API] Game not found for gameId=${gameId}`);
    return res.status(404).json({ error: 'Game not found' });
  }
   // console.log(`[API] Returning game state:`, game);
  res.json(game);
});


// Serve static files from the frontend/dist directory
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// For any other route, serve index.html (for React Router support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
