const config = require('config');
const winston = require('winston');
module.exports =function(){
	if(!config.get('jwtPrivateKey')){
	//console.log("FATAL ERROR jwt private key not defined");
	//process.ext(1)
	//standardize by throw error so single way 
	throw new Error('FATAL ERROR jwt private key not defined');
}

//configuration 
winston.info('app name: '+ config.get('name'));
}