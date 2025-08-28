// MongoDB connection utility for Express server
require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB || 'gomoku';

let client;
let db;
let hasLogged = false;

async function connectMongo() {
  if (!client || !db) {
  client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    if (!hasLogged) {
      console.log('Connected to MongoDB');
      hasLogged = true;
    }
  }
  return db;
}

module.exports = { connectMongo };
