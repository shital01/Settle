const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken');


const UserSchema = new mongoose.Schema({
	name:{
		type:String,
		required:true
	},
	phone:{type:String,unique:true}
	//friends:[String]//make it id or/And names
});

UserSchema.methods.generateAuthToken = function(){
	const token = jwt.sign({_id:this._id},config.get('jwtPrivateKey'));
	return token;
}
const User = mongoose.model('User',UserSchema);

module.exports.User =User;