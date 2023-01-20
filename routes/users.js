const express = require('express');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
//instead of app word router is used
const router = express.Router();
const Joi = require('joi');
const config = require('config');
const {User} = require('../models/user');
const auth =require('../middleware/auth');

// one is sign in then other one is login ->give jsonwebtoken then lead to other api headers,
//get me for user info not as :id for security reasons


//signup ,login ,getme
//no need,then user enough,specific user or isAdmin-which to be included in jwt
//bcrypt jwt 
//middleware login then authentic then authoriatoin we can in single function or specific api but middel ware 


router.get('/me',auth,async(req,res)=>{
	const user = await User.findById(req.user._id).select('-password');
	res.send(user);
});

//post req but first check
//try catch impliment it
//hash passowrd n salt used so hakcer popular password dont dsicover magic box


router.post('/',async(req,res)=>{
	const result = validateUser(req.body);
	console.log(result);
	if(result.error){
		res.status(400).send(result.error.details[0].message);
		return;
	}
	let user = await User.findOne({phone:req.body.phone})
	if(user) return res.status(400).send('User Already Reghistered');
//  user = new User(_.pick(req.body,['name','email','phone']))
	user = new User({
		name:req.body.name,
		email:req.body.email,
		phone:req.body.phone,
		password:req.body.password
	});
	const salt = await bcrypt.genSalt(10);
	user.password = await bcrypt.hash(user.password,salt)

	const token = user.generateAuthToken()

	await user.save();
	res.header('x-auth-token',token).send(_.pick(user,['_id','name','phone']))
	//add it 
	//console.log(user);
	//res.send(user);
});

router.put('/:id',(req,res)=>{
	//Lookup course if not 404
	//validate invalid 400-Bad request
	const result = validateUser(req.body);
	console.log(result);
	if(result.error){
		res.status(400).send(result.error.details[0].message);
		return;
	}
	//Update course and return new course
	user.name = req.body.name;

	res.send(user);
});



function validateUser(user){
	const schema=Joi.object({
	name:Joi.string().min(3).required(),
	email:Joi.string(),
	phone:Joi.number(),
	password:Joi.string()

	});
	return schema.validate(user);
}

module.exports =router;