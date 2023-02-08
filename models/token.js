const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
	token:{type:String,required:true}
});

const Token = mongoose.model('Token',TokenSchema);

function validateToken(token){
	const schema=Joi.object({
	SenderName:Joi.string().min(3).required(),
	ReceiverName:Joi.string().min(3).required(),
	Isloan:Joi.boolean().required(),
	SenderID:Joi.objectId().required(),
	ReceiverPhoneNumber:Joi.string().regex(/^[0-9]{10}$/).messages({'string.pattern.base': `Phone number must have 10 digits.`}).required(),
	SenderPhoneNumber:Joi.string().regex(/^[0-9]{10}$/).messages({'string.pattern.base': `Phone number must have 10 digits.`}).required(),
	Amount:Joi.number().integer(),
	Notes:Joi.string(),
	AttachmentsPath:Joi.array().items(Joi.string())
	});
	return schema.validate(token);
}

exports.Token = Token;
exports.validate = validateToken;
