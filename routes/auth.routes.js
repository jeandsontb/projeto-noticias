const { Router } = require('express');
const authRouter = Router();

const User = require('../models/user');

authRouter.use((req, res, next) => {
  if('user' in req.session) {
    res.locals.user = req.session.user;
    res.locals.role = req.session.role;
  }
  next();
});

authRouter.get('/change-role/:role', (req, res) => {
  if('user' in req.session) {
    if(req.session.user.roles.indexOf(req.params.role) >= 0) {
      req.session.role = req.params.role;
    }
  }
  res.redirect('/');
})

authRouter.get('/login', (req, res) => {res.render('login')});

authRouter.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });  
});

authRouter.post('/login', async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  const isValid = await user.checkPassword(req.body.password);
  
  if(isValid) { 
    req.session.user = user;
    req.session.role = user.roles[0];
    res.redirect('/restrict/news');
  } else {
    res.redirect('/login');
  }
})

module.exports = authRouter;