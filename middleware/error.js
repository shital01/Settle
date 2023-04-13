const logger = require('../startup/logging');
module.exports = function(err,req,res,next){
	// error warn info verbose debug silly->message and err object stak trace
	logger.log('error',err.message,err);
	res.status(500).send({error:{message:err.message},response:null});//500 for internal mongodb error
}