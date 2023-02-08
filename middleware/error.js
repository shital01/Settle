const winston = require('winston');
module.exports = function(err,req,res,next){
	// error warn info verbose debug silly->message and err object stak trace
	winston.log('error',err.message,err);
	res.status(500).send(err.message);//500 for internal mongodb error
}