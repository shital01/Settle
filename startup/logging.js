const config = require('config');
const winston = require('winston');
const morgan = require('morgan');
const express = require('express');

const app = express();

require	('express-async-errors');
require('winston-mongodb');
const { combine, timestamp, json, errors } = winston.format;

//exception handle 
//and unhandled rejection-random error or promise unhandled
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(errors({ stack: true }), timestamp(), json()),
  transports: [
    new winston.transports.File({ filename: 'combined.log' }),
   winston.add(new winston.transports.MongoDB({ db: config.get('db'), level: 'error',options:{useUnifiedTopology:true }})),

],

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
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const responseTime = Date.now() - start;
    logger.info(`${req.ip} - ${req.method} ${req.originalUrl} - ${res.statusCode} - ${responseTime}ms`);
  });
  next();
});

app.use(morgan('dev'));
module.exports = logger;
