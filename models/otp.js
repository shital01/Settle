const mongoose = require('mongoose');
const Joi = require('joi');

const OTPSchema = new mongoose.Schema({
	Phone:{
		type:String,
		required:true
	},
	OTP:{
		type:String,
		required:true
	}
});
const Otp = mongoose.model('Otp',OTPSchema);


function validateOTP(otp){
	const schema=Joi.object({
	Phone:Joi.string().min(10).required(),
	OTP:Joi.string().min(4).required()
	});
	return schema.validate(otp);
}

exports.validate =validateOTP;
module.exports.Otp =Otp;