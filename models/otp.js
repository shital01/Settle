const mongoose = require('mongoose');
const Joi = require('joi');
//bit of in consistence as Joi crieteria is more strict to mongoose schema required statement
const OTPSchema = new mongoose.Schema({
	PhoneNumber:{
		type:String,
		required:true
	},
	OTP:{
		type:String,
		required:true
	}
});
const Otp = mongoose.model('Otp',OTPSchema);

//helper for verify login OTP
function validatelogin(req){
	const schema=Joi.object({
	PhoneNumber:Joi.string().regex(/^[0-9]{10}$/).messages({'string.pattern.base': `Phone number must have 10 digits.`}).required(),
	OTP:Joi.string().regex(/^[0-9]{4}$/).messages({'string.pattern.base': `OTP  must have 4 digits.`}).required(),

	});
	return schema.validate(req);
}

//helper function used to validate input for generateOTP
function validateNumber(req){
	const schema=Joi.object({
	PhoneNumber:Joi.string().regex(/^[0-9]{10}$/).messages({'string.pattern.base': `Phone number must have 10 digits.`}).required()
	});
	return schema.validate(req);
}


//
function validateNumbers(req){
	const schema=Joi.object({
	PhoneNumbers:Joi.array().items(Joi.string().regex(/^[0-9]{10}$/).messages({'string.pattern.base': `Phone number must have 10 digits.`}).required())
	});
	return schema.validate(req);
}
exports.validatelogin =validatelogin;
exports.validateNumber =validateNumber;
exports.validateNumbers =validateNumbers;

module.exports.Otp =Otp;