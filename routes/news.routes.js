const { Router } = require('express');

const newsRoute = Router();
const NewsFree = require('../models/news');

newsRoute.get('/', (req, res) => {
  res.send('notícias públicas');
});

module.exports = newsRoute;