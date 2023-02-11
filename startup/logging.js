const config = require('config');
const winston = require('winston');
require	('express-async-errors');

const { combine, timestamp, json, errors } = winston.format;


const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(errors({ stack: true }), timestamp(), json()),
  transports: [new winston.transports.Console({colorize:true,prettyPrint:true})],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'exception.log' }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'rejections.log' }),
  ],
});


//logger.error(new Error("an error"));
logger.info("hey");

module.exports = logger;