const { Router } = require('express');
const authRouter = Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const dotEnv = require('dotenv');

dotEnv.config();

const User = require('../models/user');

authRouter.use(passport.initialize());
authRouter.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

//Estratégia para login local
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

//Estratégia para login facebook
passport.use(new FacebookStrategy({
  clientID: process.env.ID_FACEBOOK,
  clientSecret: process.env.SECRET_FACEBOOK,
  callbackURL:'http://localhost:3333/facebook/callback',
  profileFields: ['id', 'displayName', 'email', 'photos']
}, async (accessToken, refreshToken, profile, done) => {
  const userDB = await User.findOne({ facebookId: profile.id })
  if(!userDB) {
    const user = new User({
      name: profile.displayName,
      facebookId: profile.id,
      roles: ['restrict']
    });
    await user.save();
    done(null, user);
  } else {
    done(null, userDB);
  }
}));

//Estratégia para login google
passport.use(new GoogleStrategy({
  clientID: process.env.ID_GOOGLE,
  clientSecret: process.env.SECRET_GOOGLE,
  callbackURL:'http://localhost:3333/google/callback'
}, async (accessToken, refreshToken, err, profile, done) => {
  const userDB = await User.findOne({ googleId: profile.id })
  if(!userDB) {
    const user = new User({
      name: profile.displayName,
      googleId: profile.id,
      roles: ['restrict']
    });
    await user.save();
    done(null, user);
  } else {
    done(null, userDB);
  }
}))

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

authRouter.get('/facebook', passport.authenticate('facebook'));
authRouter.get(
  '/facebook/callback', 
  passport.authenticate('facebook', {failureRedirect: '/'}),
  (req, res) => {
    res.redirect('/');
  }
)

authRouter.get('/google', passport.authenticate('google',{scope: ['https://www.googleapis.com/auth/userinfo.profile'] }));
authRouter.get(
  '/google/callback', 
  passport.authenticate('google', {failureRedirect: '/', successRedirect: '/'})
)

module.exports = authRouter;