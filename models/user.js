const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
	Name:{type:String},
	PhoneNumber:{type:String,unique:true},
	Profile:{type:String},
	ContactsSent:{type:Boolean}
});

UserSchema.methods.generateAuthToken = function(){
	const token = jwt.sign({_id:this._id,Name:this.Name,PhoneNumber:this.PhoneNumber,ContactsSent:this.ContactsSent},config.get('jwtPrivateKey'));
	return token;
}
const User = mongoose.model('User',UserSchema);

module.exports.User =User;