const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const mongoose = require('mongoose');

const TranscationSchema = new mongoose.Schema({
	senderName:{type:String,required:true,minlength:2},
	receiverName:{type:String,required:true,minlength:2,lowercase:true},
	senderID:{
			type:mongoose.Schema.Types.ObjectId,
			ref:'User'
		},
		receiverID:{
			type:mongoose.Schema.Types.ObjectId,
			ref:'User'
		},
	Amount:Number,
	date:{type:Date,default:Date.now},
	isloan:Boolean
});

const Transcation = mongoose.model('Transcation',TranscationSchema);

function validateTranscation(transcation){
	const schema=Joi.object({
	senderName:Joi.string().min(3).required(),
	receiverName:Joi.string().min(3).required(),
	isloan:Joi.boolean(),
	senderID:Joi.objectId(),
	receiverID:Joi.objectId(),
	Amount:Joi.number().integer()
	});
	return schema.validate(transcation);
}

exports.Transcation =Transcation;
exports.validate =validateTranscation;
