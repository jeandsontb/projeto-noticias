const {Router} = require('express');
const adminRouter = Router();
const News = require('../models/news');

adminRouter.use((req, res, next) => {
  if(req.isAuthenticated) {
    if(req.user.roles.indexOf('admin') >= 0) {
      return next();
    } else {
      res.redirect('/');
    }
  }
  res.redirect('/login');
})

adminRouter.get('/', (req, res) => {
  res.send('admin page');
})

adminRouter.get('/news', async (req, res) => {
  const news = await News.find({});
  res.render('news/admin', { news });
})

module.exports = adminRouter;