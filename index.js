const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const express = require('express');
const app = express();
const winston = require('winston');

const logger = require('./startup/logging');
require('./startup/config')();

process.on('unhandledRejections',(ex) =>{
	console.log(ex)
	throw ex;//convert unhandled to uncaught for winston
});

//set DEBUG=app:startup,set by NODE_ENV=development
if((app.get('env')=== 'development')||(app.get('env')=== 'test') ){
	const morgan = require('morgan');
	app.use(morgan('tiny'));
	startupDebugger('Morgan enabled...')
}

require('./startup/routes')(app);
require('./startup/db')();
require('./startup/validate')();

if(app.get('env')=== 'production'){
require('./startup/prod')(app);

}



//not work as already return otherwise move this code it will show authentication
/*
app.use(function(req,res,next){
	winston.info('authentication ...');
	next();
});
*/

const port = process.env.PORT||3000
const server = app.listen(port,()=>logger.info(`listening to port ${port}...`));
module.exports = server
