const Joi = require('joi');

//helper function used to validate input for generateOTP
function validateMessage(req){
	const schema=Joi.object({
			SenderName:Joi.string(),
	SenderPhoneNumber:Joi.string().regex(/^[0-9]{10}$/).messages({'string.pattern.base': `Phone number must have 10 digits.`}).required(),
	ReceiverPhoneNumber:Joi.string().regex(/^[0-9]{10}$/).messages({'string.pattern.base': `Phone number must have 10 digits.`}).required(),
	Isloan:Joi.boolean().required(),
	Amount:Joi.number().integer().required(),
	TotalAmount:Joi.number().integer().required()
	});
	return schema.validate(req);
}

//helper function used to validate input for generateOTP
function validateDeleteMessage(req){

	const schema=Joi.object({
			SenderName:Joi.string(),
	SenderPhoneNumber:Joi.string().regex(/^[0-9]{10}$/).messages({'string.pattern.base': `Phone number must have 10 digits.`}).required(),
	ReceiverPhoneNumber:Joi.string().regex(/^[0-9]{10}$/).messages({'string.pattern.base': `Phone number must have 10 digits.`}).required(),
	Isloan:Joi.boolean().required(),
	Amount:Joi.number().integer().required(),
	TransactionDate:Joi.date(),
	TotalAmount:Joi.number().integer().required()
	});
	return schema.validate(req);
}

//helper function used to validate input for generateOTP
function validateRemindMessage(req){
	const schema=Joi.object({
			SenderName:Joi.string(),
	SenderPhoneNumber:Joi.string().regex(/^[0-9]{10}$/).messages({'string.pattern.base': `Phone number must have 10 digits.`}).required(),
	ReceiverPhoneNumber:Joi.string().regex(/^[0-9]{10}$/).messages({'string.pattern.base': `Phone number must have 10 digits.`}).required(),
	TotalAmount:Joi.number().integer().required()
	});
	return schema.validate(req);
}

exports.validateMessage =validateMessage;
exports.validateRemindMessage =validateRemindMessage;
exports.validateDeleteMessage =validateDeleteMessage;