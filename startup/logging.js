const config = require('config');
const winston = require('winston');

//in console,file,http request   mongodb,couchdb,redis,loggly
//3.00 versin for winston mongo db
//process restart code

//for testing comment this 
require('winston-mongodb');
require	('express-async-errors');

//missing catch for promise
module.exports = function(){
	winston.add( new winston.transports.File({filename:'logfile.log'}));

process.on('unhandledRejections',(ex) =>{
	throw ex;//convert unhandled to uncaught for winston
});

//after this process terminate and restart not know source of error 
//alternate winston to handle
//show unhandled execptions in console
winston.add(new winston.transports.Console({colorize:true,prettyPrint:true}))
winston.exceptions.handle(new winston.transports.File({filename:'uncaughtExceptions.log'}))

//can set level as info so error warn n info comes under it
//file in offline better and mongodb logging for better filtering query
//for testing comment,
//currently permissoin issue wokr wiht file instead nuableto store in db
/*
winston.add(new winston.transports.MongoDB({db:config.get('localdb'),
	level:'info',
	collections:"debug"
	}))
	*/
}