const express = require('express');
//instead of app word router is used
const router = express.Router();
const Joi = require('joi');
const config = require('config');
const {User} = require('../models/user');
const auth =require('../middleware/auth');
const dbDebugger = require('debug')('app:db');

const {validateNumber,validateNumbers} = require('../models/otp');

/*
Input->
Name-String
Output->
Procedure->
Validate Header
Validate Input
Find user by id
Update user Name
Return ->
If Successful then Return UserObject
If token invalid then 400 and 401 if not provided
If validation fail then code 400 and error message
If user does not exist then 400 with error message
If something else fail like database saving then Response send with code 500 and error message
*/
router.put('/UpdateProfile',auth,async(req,res)=>{
	const result = validateUpdateUser(req.body);
	if(result.error){
		dbDebugger(result.error.details[0].message)
		res.status(400).send({error:result.error.details[0],response:null});
		//res.status(400).send(result.error.details[0].message);
		return;
	}
	let user = await User.findById(req.user._id);//for token regeneration hence not one lien do
	if(!user) return res.status(400).send({error:{message:'No User exits'},response:null})
	if(req.body.Name){user.Name=req.body.Name;}
	if(req.body.Profile){user.Profile =req.body.Profile;}
	const user2 = await user.save();
	const token = user2.generateAuthToken()
	res.header('x-auth-token',token).send({error:null,response:user2});
});

//friendprofile pic
router.post('/FriendProfile',auth,async(req,res)=>{
	const result = validateNumber(req.body);
	if(result.error){
		dbDebugger(result.error.details[0].message)
		res.status(400).send({error:result.error.details[0],response:null});
//		res.status(400).send(result.error.details[0].message);
		return;
	}
	const user = await User.find({PhoneNumber:req.body.PhoneNumber})
	if(user.length===0) return res.status(400).send({error:{message:'No User exits'},response:null})
	if(!user[0].Profile) return res.status(400).send({error:{message:'No Profile Picture'},response:null})
	res.send({error:null,response:user[0]});
})




//friendsprofile pic
router.post('/FriendsProfile',auth,async(req,res)=>{
	const result = validateNumbers(req.body);
	if(result.error){
		dbDebugger(result.error.details[0].message)
		res.status(400).send({error:result.error.details[0],response:null});
//		res.status(400).send(result.error.details[0].message);
		return;
	}
	const users = await User.find({PhoneNumber: { $in: req.body.PhoneNumbers}}).select("PhoneNumber Profile Name")
	if(users.length===0) return res.status(400).send({error:{message:'No User exits'},response:null})
	//if(!user[0].Profile) return res.status(400).send('No Profile Picture')
	res.send({error:null,response:users});
})


function validateUpdateUser(user){
	const schema=Joi.object({
	Name:Joi.string().allow(null, ''),
	Profile:Joi.string().allow(null, '')
	});
	return schema.validate(user);
}

module.exports =router;