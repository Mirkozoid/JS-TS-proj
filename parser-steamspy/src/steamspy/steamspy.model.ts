import mongoose from 'mongoose';

const TrendingSchema = new mongoose.Schema({
  rank: String,
  game: String,
  releaseDate: String,
  price: String,
  scoreRank: String,
  owners: String
});
const RecentSchema = new mongoose.Schema({
  rank: String,
  game: String,
  releaseDate: String,
  price: String,
  scoreRank: String,
  owners: String,
  playtime: String
}); 
const UpcomigGameSchema = new mongoose.Schema({
  title: String,
  developer: String,
  publisher: String,
  genre: String,
  followers: String,
  releaseDate: String,
  owners: String
});

const Trending = mongoose.model('Trending', TrendingSchema);
const Recent = mongoose.model('Recent', RecentSchema);
const UpcomingGame = mongoose.model('UpcomingGame', UpcomigGameSchema);

export default { Trending, Recent, UpcomingGame };
