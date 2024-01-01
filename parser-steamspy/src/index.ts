require('dotenv').config();
import mongoose from 'mongoose';
import { getInfoTrendingRecentGames } from './steamspy/getTrendingRecentGamesHTML';
import { getUpcomingGameInfo } from './steamspy/getUpcomingGamesHTML';
import { UrlHostMongo } from './config/env'

mongoose.connect(UrlHostMongo);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async function() {
  console.log("Connected to MongoDB!");
  await getInfoTrendingRecentGames();
  await getUpcomingGameInfo();
});