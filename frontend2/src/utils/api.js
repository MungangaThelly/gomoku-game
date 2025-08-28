const API_BASE = '';

export async function register(username, password) {
  const res = await fetch(`${API_BASE}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

export async function login(username, password) {
  const res = await fetch(`${API_BASE}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

export async function saveScore(username, score) {
  const res = await fetch(`${API_BASE}/api/score`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, score }),
  });
  return res.json();
}

export async function getScores(username) {
  const res = await fetch(`${API_BASE}/api/scores/${username}`);
  return res.json();
}

export async function createGame(username) {
  const res = await fetch(`${API_BASE}/api/game/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  });
  return res.json();
}

export async function joinGame(username, gameId) {
  const res = await fetch(`${API_BASE}/api/game/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, gameId }),
  });
  return res.json();
}

export async function sendMove(gameId, move) {
  const res = await fetch(`${API_BASE}/api/game/move`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ gameId, move }),
  });
  return res.json();
}

export async function getGame(gameId) {
  const res = await fetch(`${API_BASE}/api/game/${gameId}`);
  return res.json();
}
