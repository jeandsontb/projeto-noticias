const { Router } = require('express');
const authRouter = Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

authRouter.use(passport.initialize());
authRouter.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(new LocalStrategy(async (username, password, done) => {
  const user = await User.findOne({ username });
  if(user) {
    const isValid = await user.checkPassword(password);
    if(isValid) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } else {
    return done(null, false);
  }
}));

authRouter.use((req, res, next) => {
  if(req.isAuthenticated()) {
    res.locals.user = req.user;
    if(!req.session.role) {
      req.session.role = req.user.roles[0];
    }
    res.locals.role = req.session.role;
  }
  next();
});

authRouter.get('/change-role/:role', (req, res) => {
  if(req.isAuthenticated()) {
    if(req.user.roles.indexOf(req.params.role) >= 0) {
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

authRouter.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: false
}));

module.exports = authRouter;