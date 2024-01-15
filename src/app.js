const express = require('express');
const morgan = require('morgan')
require('dotenv').config()

const path = require('path');


const app = express();


const webRouter = require('./web/webRoutes');
const apiRouter = require('./api/apiRoutes');

app.use(morgan('common'));

app.use(express.json()) // body parser: json
app.use(express.urlencoded({ extended: true })); // body parser: formdata

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use('/api', apiRouter);
app.use('/', webRouter)

app.get('*', async (req, res) => {
    let message
	res.status(404).render('404')
})



module.exports = app
