const express = require('express');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const Joi = require('joi');
const config = require('config');
const {User} = require('../models/user');

//login
//differnt type of validator
//then if findone failed tell invalid email or password as to nto give any hint


router.post('/',async(req,res)=>{
	const result = validate(req.body);
	console.log(result);
	if(result.error){
		res.status(400).send(result.error.details[0].message);
		return;
	}
	let user = await User.findOne({phone:req.body.phone})
	if(!user) return res.status(400).send('Invalid email or paaassword');
	
	//instead compare the OTP with entered OTP after findone and after finding OTP

	const validPassword =await bcrypt.compare(req.body.password,user.password)
	console.log(validPassword)
	if(!validPassword) return res.status(400).send('Invalid email or password');
	const token = user.generateAuthToken();
	res.send(token);

	//add it 
	//console.log(user);
	//res.send(user);
});


//different validate for login
function validate(user){
	const schema=Joi.object({
	password:Joi.string().min(3).required(),
	phone:Joi.number()
	});
	return schema.validate(user);
}

module.exports =router;