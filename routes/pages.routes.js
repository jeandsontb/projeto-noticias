const { Router } = require('express');
const pagesRouter = Router();

pagesRouter.get('/', (req, res) => {res.render('index')});

module.exports = pagesRouter;