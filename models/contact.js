const mongoose = require('mongoose');
const Joi = require('joi');
//bit of in consistence as Joi crieteria is more strict to mongoose schema required statement
const ContactSchema = new mongoose.Schema({
	PhoneNumber:{
		type:String,
		required:true
	},
	Name:{
		type:String,
		required:true
	},
	ContactProviderNumber:{
		type:String,
		required:true
	},
	ContactProviderName:{
		type:String,
		required:true
	}
});
const Contact = mongoose.model('Contact',ContactSchema);


//helper for verify Contact list-10 digit is the issue
function validateContact(req){
	const schema=Joi.object({
	PhoneNumber:Joi.string().regex(/^[0-9]{10}$/).messages({'string.pattern.base': `Phone number must have 10 digits.`}).required(),
	//OTP:Joi.string().regex(/^[0-9]{4}$/).messages({'string.pattern.base': `OTP  must have 4 digits.`}).required(),

	});
	return schema.validate(req);
}


exports.validateContact =validateContact;
exports.Contact =Contact;