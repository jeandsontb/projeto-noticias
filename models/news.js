const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
  title: String,
  content: String,
  category: String
});

const News = mongoose.model('News', NewsSchema);
module.exports = News;