const mongoose = require('mongoose');
const winston = require('winston');

module.exports = function(){
	 mongoose.set('strictQuery', false);//to check right choice
mongoose.connect('mongodb://localhost/playground4',{family: 4})
	.then(()=>console.log('Connected to Mongodb...'))
//	.catch(err => dbDebugger('couldnot connect to mongodb',err))//as not logging enough need to terminate so done seperately
}