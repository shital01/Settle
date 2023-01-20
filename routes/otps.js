const express = require('express');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const Joi = require('joi');
const config = require('config');
const {Otp} = require('../models/otp');
const auth =require('../middleware/auth');


//for signup-verifyOTP
//for login-VerifyOTP
//generateOTP

//for signup verify stuff-->check for user alreadyexits or not then if do then return else chekc in OTP list then if true then create user

router.post('/verifySignupOTP',async(req,res)=>{
	const result = validate(req.body);
	console.log(result);
	if(result.error){
		res.status(400).send(result.error.details[0].message);
		return;
	}
	let user = await User.findOne({phone:req.body.phone})
	if(user) return res.status(400).send('User Already Registered');
	//get latest otp entry-to be changed
	let otps = await Otp.findOne({phone:req.body.phone})
	if(!otps) return res.status(404).send('Invalid OTP');
	const validotp =await bcrypt.compare(req.body.otp,otps.OTP)
	if(!validotp) return res.status(404).send('Invalid OTP');
//  user = new User(_.pick(req.body,['name','email','phone']))
	user = new User({
		name:req.body.name,
		//email:req.body.email,
		phone:req.body.phone,
		password:req.body.password
	});
	const salt = await bcrypt.genSalt(10);
	user.password = await bcrypt.hash(user.password,salt)
	const token = user.generateAuthToken()
	await user.save();
	res.header('x-auth-token',token).send(_.pick(user,['_id','name','phone']))
});


//for login ,find user if true ,then verify Otp
router.post('/verifyloginOTP',async(req,res)=>{
	const result = validate(req.body);
	console.log(result);
	if(result.error){
		res.status(400).send(result.error.details[0].message);
		return;
	}
	let user = await User.findOne({phone:req.body.phone})
	if(!user) return res.status(400).send('User Not Registered');
	//get only latest entry
	let otps = await Otp.findOne({phone:req.body.phone,otp:req.body.otp})
	if(!otps) return res.status(404).send('Invalid OTP');
	const validotp =await bcrypt.compare(req.body.otp,otps.OTP)
	if(!validotp) return res.status(404).send('Invalid OTP');
	const token = user.generateAuthToken()
	await user.save();
	res.header('x-auth-token',token).send(_.pick(user,['_id','name','phone']))
});

function generateOTP() {       
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++ ) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

//Generate OTP->input phone ,add entry in otp ,send sms
router.post('/generateOTP',async(req,res,next)=>{
	const result = validateNumber(req.body);
	console.log(result);
	if(result.error){
		res.status(400).send(result.error.details[0].message);
		return;
	}
	const OTP =generateOTP();
	const otp = new Otp({
		Phone:req.body.Phone,
		OTP:req.body.Otp
	});
	const salt = await bcrypt.genSalt(10);
	otp.OTP = await bcrypt.hash(otp.OTP,salt)
	//handled error of mongodb saves
	const result = await otp.save();
	//sendSMS
	
		//dbDebugger(ex.message);
		//internal server error incase someone stop mongodb code 500 and also if it reopen after one minute app isnt hanged
		//res.status(500).send(ex.message);
//		for(field in ex.errors)
//			dbDebugger(ex.errors[field].message);
	res.send(true)
	//add it 
	//console.log(user);
	//res.send(user);
});


function validate(req){
	const schema=Joi.object({
	phone:Joi.number()
	});
	return schema.validate(req);
}

function validateNumber(req){
	const schema=Joi.object({
	phone:Joi.number()
	});
	return schema.validate(req);
}
module.exports =router;