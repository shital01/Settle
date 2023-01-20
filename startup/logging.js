const winston = require('winston');
//in console,file,http request   mongodb,couchdb,redis,loggly
//3.00 versin for winston mongo db
//process restart code
require('winston-mongodb');
require	('express-async-errors');

//missing catch for promise
module.exports = function(){
process.on('unhandledRejections',(ex) =>{
	throw ex;//convert unhandled to unaught for winston
});

//after this process terminate and restart not know source of error 
//alternate winston to handle
//show unhandled execptions in console
new winston.transports.Console({colorize:true,prettyPrint:true})
winston.exceptions.handle(new winston.transports.File({filename:'uncaughtExceptions.log'}))

winston.add( new winston.transports.File({filename:'logfile.log'}));
//can set level as info so error warn n info comes under it
//file in offline better and mongodb logging for better filtering query
winston.add( new winston.transports.MongoDB({db:'mongodb://localhost/playground4',level:'info'}))
}