const mongoose = require('mongoose');
const Joi = require('joi');
//bit of in consistence as Joi crieteria is more strict to mongoose schema required statement

const ContactsSchema = new mongoose.Schema({
	P:{
		type:String,
		required:true
	},
	N:{
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
const Contacts = mongoose.model('Contacts',ContactsSchema);



exports.Contacts =Contacts;
