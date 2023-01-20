const express = require('express');


const users = require('../routes/users');
const transcations = require('../routes/transcations');
const auth = require('../routes/auth');
const home = require('../routes/home');

const helmet = require('helmet');
const logger = require('../middleware/logger');

const error = require('../middleware/error')


module.exports = function(app){
	app.use(express.json());//to set post request
	app.use(express.urlencoded({extended:true}));//post ,x-html form to  body 
	app.use(express.static('public'));//for allow all public folder asset to be accesed by url
	app.use(helmet());
	app.use(logger);
	app.use('/api/users',users);
	app.use('/api/transcations',transcations);
	app.use('/api/auth',auth);
	app.use('/',home);
	app.use(error);
}