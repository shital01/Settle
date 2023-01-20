function log(req,res,next){
	console.log('Logging the incoming request');
	next();
}
module.exports = log