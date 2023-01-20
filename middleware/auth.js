const jwt = require('jsonwebtoken');
const config = require('config');
//in few api call if user is needed to logged(use this middelware first) check header and pass user object for further api otherwise Access Denied
function auth (req,res,next){
	const token = req.header('x-auth-token');
	if(!token) return res.status(401).send('Access denied NO token Provided');
	try{
	const decoded =	jwt.verify(token,config.get('jwtPrivateKey'));
	req.user =decoded;//after reading header set user object of request for further idea
	next();
	}
	catch(ex){
		res.status(400).send('Invalid Token')
	}
}

module.exports = auth;