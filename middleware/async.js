//to remove try ctahc in code n pure logic and modify wrap it in this function

module.exports = function asyncMiddleware(handler){
	return async (req,res,next)=>{
	try{
		await handler(req,res);
	}
	catch(ex){
	next(ex);
	}
	};
}