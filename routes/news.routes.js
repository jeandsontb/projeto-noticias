const { Router } = require('express');

const newsRoute = Router();
const News = require('../models/news');

newsRoute.get('/', async (req, res) => {
  // let conditions = {};

  // if(!('user' in req.session)) {
  //   conditions = { category: 'public' };
  // }
  const conditions = { category: 'public' };
  const news = await News.find(conditions);
  res.render('news/index', { news });
});

module.exports = newsRoute;