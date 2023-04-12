const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
	SenderName:{type:String,required:true,minlength:1},
	ReceiverName:{type:String,required:true,minlength:1,lowercase:true},
	SenderID:{
			type:mongoose.Schema.Types.ObjectId,
			ref:'User',
			required:true
		},
	ReceiverPhoneNumber:{type:String,required:true},
	SenderPhoneNumber:{type:String,required:true},
	Amount:{type:Number,required:true},
	TransactionDate:Date,
	UpdatedDate:{type:Date,default:new Date(new Date().getTime()+330*60*1000)},
	Isloan:{type:Boolean,required:true},
	deleteFlag:Boolean,
	Notes:String,
	AttachmentsPath:[{type:String}]
});

const Transaction = mongoose.model('Transaction',TransactionSchema);

function validateTransaction(transaction){
	const schema=Joi.object({
	SenderName:Joi.string().min(1).required(),
	ReceiverName:Joi.string().min(1).required(),
	Isloan:Joi.boolean().required(),
	deleteFlag:Joi.boolean(),
	SenderID:Joi.objectId().required(),
	TransactionDate:Joi.date().required(),
	ReceiverPhoneNumber:Joi.string().regex(/^[0-9]{10}$/).messages({'string.pattern.base': `Phone number must have 10 digits.`}).required(),
	SenderPhoneNumber:Joi.string().regex(/^[0-9]{10}$/).messages({'string.pattern.base': `Phone number must have 10 digits.`}).required(),
	Amount:Joi.number().integer().required(),
	Notes:Joi.string().allow(null, ''),
	AttachmentsPath:Joi.array().items(Joi.string())
	});
	return schema.validate(transaction);
}

function validateUpdateTransaction(transaction){
	const schema=Joi.object({
	TransactionId:Joi.objectId().required(),
	ReceiverName:Joi.string().min(1),
	Isloan:Joi.boolean(),
	deleteFlag:Joi.boolean(),
	SenderID:Joi.objectId(),
	TransactionDate:Joi.date(),
	ReceiverPhoneNumber:Joi.string().regex(/^[0-9]{10}$/).messages({'string.pattern.base': `Phone number must have 10 digits.`}),
	SenderPhoneNumber:Joi.string().regex(/^[0-9]{10}$/).messages({'string.pattern.base': `Phone number must have 10 digits.`}),
	Amount:Joi.number().integer(),
	Notes:Joi.string().allow(null, ''),
	AttachmentsPath:Joi.array().items(Joi.string())
	});
	return schema.validate(transaction);
}

function validateDeleteTransaction(transaction){
	const schema=Joi.object({
	TransactionId:Joi.objectId(),
	SenderID:Joi.objectId()
	});
	return schema.validate(transaction);
}
//not much point pass all values
function validateRequestTransaction(transaction){
	const schema=Joi.object({
		lastUpdatedDate:Joi.date().required()
	});
	return schema.validate(transaction);
}
exports.Transaction = Transaction;
exports.validate = validateTransaction;

exports.validateRequestTransaction =validateRequestTransaction;
exports.validateDeleteTransaction =validateDeleteTransaction;
exports.validateUpdateTransaction =validateUpdateTransaction;


