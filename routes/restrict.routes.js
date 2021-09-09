const {Router} = require('express');
const restrictRouter = Router();

restrictRouter.get('/', (req, res) => {
  res.send('restrict page');
})

restrictRouter.get('/news', (req, res) => {
  res.send('noticias restritas')
})

module.exports = restrictRouter;