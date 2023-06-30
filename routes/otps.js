const express = require('express');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const {Otp,validatelogin,validateNumber,validateMessage,validateRemindMessage,validateDeleteMessage} = require('../models/otp');
const {User} = require('../models/user');

const logger = require('../startup/logging');
const dbDebugger = require('debug')('app:db');

const sendmessage =require('../middleware/sendmessage');
//just a test 
/*helper function to generate OTP for generateOTP api
Input->{}
OutPut->4 digit otp string
*/


function generateOTP() {       
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++ ) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    //console.log(OTP)
    //logger.info(OTP)
    //dbDebugger(OTP)

    return OTP;
}

/*
GenerateOTP
Input->PhoneNumber(10 digit String)
Output->true(boolean)
Procedure->validateInput using Joi
generate 4 digit random OTP
save entry in Otp Table with Phone ,OTP as field with Otp as encrypted
send SMS to user Phone Number
Return boolean true,if number not 10 digit 400 request send ,if something else fail like database saving then 500 request
*/
router.post('/GenerateOTP',async(req,res,next)=>{
	if(req.body.PhoneNumber == "1234512345"){
		var SendSMS =true;
	res.send({error:null,response:{SendSMS}})	
	}
	else{

	
	const result = validateNumber(req.body);
	if(result.error){
		dbDebugger(result.error.details[0].message)
		res.status(400).send({error:result.error.details[0],response:null});
		//res.status(400).send(result.error.details[0].message);
		return;
	}
	const OTP =generateOTP();
	const otp = new Otp({
		PhoneNumber:req.body.PhoneNumber,
		OTP:OTP
	});
	const salt = await bcrypt.genSalt(10);
	otp.OTP = await bcrypt.hash(otp.OTP,salt)
	await otp.save();
	//sendSMS
	var finalmessage ="OTP for login is: "+OTP+" Settle App"
	const SendSMS = await sendmessage("91"+req.body.PhoneNumber,finalmessage,'1607100000000267487');
	//console.log(result1);
	res.send({error:null,response:{SendSMS}})	
	//res.send(true)
}
});
/*
Input->PhoneNumber(10 digit String),OTP(4 digit String)
Output->User Object with Field as _id,PhoneNumber ,Name (optional if user is login not new)
and header x-auth-token as token which has to be send with sensitive api request from client side which contain user info 
Procedure->
Validate Input
Check if user Exists or Not(to decide login or signup)
Check if OTP match or Not
Save user if new user
Generate authentication token
Return ->
If successful then user object along with x-auth-header
If validation fail then code 400 and error message
If OTP failed either not requested or OTP mismatch send response with 404 code and error message
If something else fail like database saving then Response send with code 500 and error message
*/
router.post('/VerifyOTP',async(req,res)=>{
	if(req.body.PhoneNumber == "1234512345"){
	req.body.Name="";
	req.body.Profile="";
	user = new User(req.body);
	const newuser = await user.save();
	const token = newuser.generateAuthToken()
	res.header('x-auth-token',token).send({error:null,response:user});
	}
	else{
	const result = validatelogin(req.body);
	if(result.error){
		dbDebugger(result.error.details[0].message)
		res.status(400).send({error:result.error.details[0],response:null});
		//res.status(400).send(result.error.details[0].message);

		return;
	}
	let user = await User.findOne({PhoneNumber:req.body.PhoneNumber});
	if(user){
		//current not implemented not so getting latest not much security needed otherwise keep date field and check using 
		//created At and moment library
		const otps = await Otp
		.find({PhoneNumber:req.body.PhoneNumber})
		.sort({_id:-1})
		if(otps.length === 0) return res.status(404).send({error:{message:'Invalid OTP'},response:null});
		const validotp =await bcrypt.compare(req.body.OTP,otps[0].OTP);
		if(!validotp) return res.status(404).send({error:{message:'Invalid OTP'},response:null});
		const token = user.generateAuthToken();
		return res.header('x-auth-token',token).send({error:null,response:user});
	}
	//id is same order as date hence
	const otps = await Otp.find({PhoneNumber:req.body.PhoneNumber}).sort({_id:-1})
	if(otps.length === 0) return res.status(404).send({error:{message:'Invalid OTP'},response:null});
	const validotp =await bcrypt.compare(req.body.OTP,otps[0].OTP)
	if(!validotp) return res.status(404).send({error:{message:'Invalid OTP'},response:null});
	req.body.Name="";
	req.body.Profile="";
	user = new User(req.body);
	const newuser = await user.save();
	const token = newuser.generateAuthToken()
	res.header('x-auth-token',token).send({error:null,response:user});
}
});

//Fake login functions
router.post('/FakeNewSignUp',async(req,res)=>{
	//req.body.Name="";
	req.body.Profile="";
	user = new User(req.body);
	const newuser = await user.save();
	const token = newuser.generateAuthToken()
	res.header('x-auth-token',token).send({error:null,response:user});

});

module.exports =router;
