const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const express = require('express');
const app = express();
const winston = require('winston');

require('./startup/logging');
require('./startup/config')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/validate');
require('./startup/prod')(app);//make it condition

const morgan = require('morgan');
//set DEBUG=app:startup
if(app.get('env')=== 'development'){//set by NODE_ENV
	app.use(morgan('tiny'));
	startupDebugger('Morgan enabled...')
}


app.use(function(req,res,next){
	winston.log('authentication ...');
	next();
});

const port = process.env.PORT||3000
app.listen(port,()=>winston.info(`listening to port ${port}...`));
