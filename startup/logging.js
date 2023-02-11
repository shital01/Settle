const config = require('config');
const winston = require('winston');
require	('express-async-errors');

const { combine, timestamp, json, errors } = winston.format;

//exception handle 
//and unhandled rejection-random error or promise unhandled
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(errors({ stack: true }), timestamp(), json()),
  transports: [
   new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'exception.log' }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'rejections.log' }),
  ],

});
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
    colorize:true,prettyPrint:true
  }));
}
//logger.error(new Error("an error"));
logger.info("hey");

module.exports = logger;