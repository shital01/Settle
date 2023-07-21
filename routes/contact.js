const express = require('express');
const router = express.Router();
const {Contact,validateContact} = require('../models/contact');
const {Contacts} = require('../models/contacts');

const logger = require('../startup/logging');
const auth = require('../middleware/auth');
const {User} = require('../models/user');

const dbDebugger = require('debug')('app:db');

/*
AddContact
Input->PhoneNumber(10 digit String)
Output->true(boolean)
Procedure->validateInput using Joi
generate 4 digit random OTP
save entry in Otp Table with Phone ,OTP as field with Otp as encrypted
send SMS to user Phone Number
Return boolean true,if number not 10 digit 400 request send ,if something else fail like database saving then 500 request
*/
router.post('/AddContact',auth,async(req,res,next)=>{
		req.body.ContactProviderName = req.user.Name;
		req.body.ContactProviderNumber = req.user.PhoneNumber;
		documents = req.body.Contacts;
// Add a new field to all documents with the same value
documents.forEach((document) => {
  document.ContactProviderNumber = req.body.ContactProviderNumber;
  document.ContactProviderName = req.body.ContactProviderName;
});
	var results = await Contact.insertMany(documents);
	res.send({error:null,response:{results}})	
	//res.send(true)
});
//keep track so extra not send and also reduce return data,version 2 as not inconsistency occurs
//use C,P,N to reduce size
router.post('/AddContacts',auth,async(req,res,next)=>{
		req.body.CN = req.user.Name;
		req.body.CP = req.user.PhoneNumber;
		documents = req.body.C;//Contacts
	// Add a new field to all documents with the same value
	documents.forEach((document) => {
	  document.ContactProviderNumber = req.body.CP;//ContactProviderNumber
	  document.ContactProviderName = req.body.CN;//ContactProviderName
	});
	var results = await Contacts.insertMany(documents);
	let user = await User.findById(req.user._id);//for token regeneration hence not one lien do
	if(!user) return res.status(400).send({error:{message:'No User exits'},response:null})
	user.ContactsSent = true;
	const user2 = await user.save();
	const token = user2.generateAuthToken()
	res.header('x-auth-token',token).send({error:null,response:user2});
});

module.exports =router;
