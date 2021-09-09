const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const User = require('./models/user');
const newsRoute = require('./routes/news.routes');

mongoose.Promise = global.Promise;
dotenv.config();

const mongo = process.env.MONGO;
const port = process.env.PORT;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use('/news', newsRoute);

app.get('/', (req, res) => {res.render('index')});

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
