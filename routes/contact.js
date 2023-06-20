const express = require('express');
const router = express.Router();
const {Contact,validateContact} = require('../models/contact');

const logger = require('../startup/logging');
const auth = require('../middleware/auth');

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


module.exports =router;
