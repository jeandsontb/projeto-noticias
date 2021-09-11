const {Router} = require('express');
const restrictRouter = Router();
const News = require('../models/news');

restrictRouter.use((req, res, next) => {
  if('user' in req.session) {
    if(req.session.user.roles.indexOf('restrict') >= 0) {
      return next();
    } else {
      res.redirect('/');
    }
  }
  res.redirect('/login');
})

restrictRouter.get('/', (req, res) => {
  res.send('restrict page');
})

restrictRouter.get('/news', async (req, res) => {
  const news = await News.find({ category: 'private' });
  res.render('news/restrict', { news });
})

module.exports = restrictRouter;