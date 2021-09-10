const express = require('express');
const session = require('express-session');
const app = express();
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const User = require('./models/user');
const News = require('./models/news');
const newsRoute = require('./routes/news.routes');
const restrictRoute = require('./routes/restrict.routes');
const authRouter = require('./routes/auth.routes');
const pagesRouter = require('./routes/pages.routes');

mongoose.Promise = global.Promise;
dotenv.config();

const mongo = process.env.MONGO;
const port = process.env.PORT;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use(session({ secret: 'jeandson-fullstack' }));

app.use('/', authRouter);
app.use('/', pagesRouter);
app.use('/news', newsRoute);
app.use('/restrict', restrictRoute);

//Verifica se tem um usuário inicial no banco de dados se não tiver cria ele.
const createInitialUser = async () => {
  const total = await User.countDocuments({username: 'jeandson'});
  if(total === 0 ) {
    const user = new User({
      username: 'jeandson', //cria um usuário jeandson 
      password: '123456' // adiciona essa senha para esse usuário padrão
    });
    await user.save();
    console.log('user created');
  } else {
    console.log('user created skipped');
  }

  // const news = new News({
  //   title: 'Notícia pública '+new Date().getTime(),
  //   content: 'content',
  //   category: 'public'
  // });

  // await news.save();

}

mongoose.connect(mongo, {
  useNewUrlParser: true, 
  useUnifiedTopology: true
})
.then(() => {
  createInitialUser();
  app.listen(port, () => console.log('Server running in port ', port));
})
.catch(err => console.log(err));
