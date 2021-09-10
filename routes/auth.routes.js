const { Router } = require('express');
const authRouter = Router();

const User = require('../models/user');

authRouter.get('/login', (req, res) => {res.render('login')});

authRouter.post('/login', async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  const isValid = await user.checkPassword(req.body.password);
  
  if(isValid) { 
    req.session.user = user;
    res.redirect('/restrict/news');
  } else {
    res.redirect('/login');
  }
})

module.exports = authRouter;