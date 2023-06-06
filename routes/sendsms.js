const express = require('express');
const router = express.Router();
const {validateMessage,validateRemindMessage,validateDeleteMessage} = require('../models/otp');

const logger = require('../startup/logging');
const dbDebugger = require('debug')('app:db');

const sendmessage =require('../middleware/sendmessage');
/*
SendSMS
Input->PhoneNumber(10 digit String)
Output->true(boolean)
Procedure->validateInput using Joi
generate 4 digit random OTP
save entry in Otp Table with Phone ,OTP as field with Otp as encrypted
send SMS to user Phone Number
Return boolean true,if number not 10 digit 400 request send ,if something else fail like database saving then 500 request
*/
router.post('/TransactionalSMS',async(req,res,next)=>{
	
	const result = validateMessage(req.body);
	if(result.error){
		dbDebugger(result.error.details[0].message)
		res.status(400).send({error:result.error.details[0],response:null});
		//res.status(400).send(result.error.details[0].message);
		return;
	}
	var link ="link";
	var message="";
	if(req.body.Isloan){
		 message = req.body.SenderPhoneNumber+" gave "+req.body.ReceiverPhoneNumber+" Rs "+req.body.Amount+". \n Now Balance is Rs "+req.body.TotalAmount+". \n See all txns: "+link+" \n Settle App";
	}
	else{
		 message = req.body.ReceiverPhoneNumber+" gave "+req.body.SenderPhoneNumber+" Rs "+req.body.Amount+". \n Now Balance is Rs "+req.body.TotalAmount+". \n See all txns: "+link+" \n Settle App";
	}
	const SendSMS = await sendmessage("91"+req.body.ReceiverPhoneNumber,message,'1607100000000265753');
	//console.log(result1);
	res.send({error:null,response:{SendSMS}})	
	
});
//Delete SMS

//Delete SMS
//hide ids later along wiht priniciple
router.post('/DeleteSMS',async(req,res,next)=>{
	
	const result = validateDeleteMessage(req.body);
	if(result.error){
		dbDebugger(result.error.details[0].message)
		res.status(400).send({error:result.error.details[0],response:null});
		//res.status(400).send(result.error.details[0].message);
		return;
	}
	var link ="link";
	var finalmessage = "Deleted: \n "+req.body.SenderPhoneNumber+" gave "+req.body.ReceiverPhoneNumber+" Rs "+req.body.Amount+". "+req.body.TransactionDate+". \n Bal: Rs "+req.body.TotalAmount+". \n Download: "+link+" Settle App";
	const SendSMS = await sendmessage("91"+req.body.ReceiverPhoneNumber,finalmessage,'1607100000000265754');
	//console.log(result1);
	res.send({error:null,response:{SendSMS}})	
	
});
//Engagement SMS
router.post('/RemindSMS',async(req,res,next)=>{
	
	const result = validateRemindMessage(req.body);
	if(result.error){
		dbDebugger(result.error.details[0].message)
		res.status(400).send({error:result.error.details[0],response:null});
		//res.status(400).send(result.error.details[0].message);
		return;
	}
	
	var link ="link";
	var finalmessage = "Your balance with "+req.body.SenderPhoneNumber+" is Rs "+req.body.TotalAmount+". \n See all txns: "+link+" \n Settle App";
	const SendSMS = await sendmessage("91"+req.body.ReceiverPhoneNumber,finalmessage,'1607100000000265755');
	//console.log(result1);
	res.send({error:null,response:{SendSMS}})	
	
});
module.exports =router;
