const express = require('express');
//instead of app word router is used
const router = express.Router();
const Joi = require('joi');
const config = require('config');
const {User} = require('../models/user');
const auth =require('../middleware/auth');
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
		res.status(400).send(result.error.details[0].message);
		return;
	}
	let user = await User.findById(req.user._id);//for token regeneration hence not one lien do
	if(!user) return res.status(400).send('No User Found')
	user.Name=req.body.Name;
	user.Profile =req.body.Profile;
	const user2 = await user.save();
	const token = user2.generateAuthToken()
	res.header('x-auth-token',token).send(user2);
});

//friendprofile pic
router.get('/FriendProfile',auth,async(req,res)=>{
	const result = validateNumber(req.body);
	if(result.error){
		res.status(400).send(result.error.details[0].message);
		return;
	}
	const user = await User.find({PhoneNumber:req.body.PhoneNumber})
	if(user.length===0) return res.status(400).send('No User exits')
	if(!user[0].Profile) return res.status(400).send('No Profile Picture')
	res.send(user[0]);
})




//friendsprofile pic
router.get('/FriendsProfile',auth,async(req,res)=>{
	const result = validateNumbers(req.body);
	if(result.error){
		res.status(400).send(result.error.details[0].message);
		return;
	}
	const users = await User.find({PhoneNumber: { $in: req.body.PhoneNumbers}}).select("PhoneNumber Profile Name")
	if(users.length===0) return res.status(400).send('No User exits')
	//if(!user[0].Profile) return res.status(400).send('No Profile Picture')
	res.send(users);
})


function validateUpdateUser(user){
	const schema=Joi.object({
	Name:Joi.string(),
	Profile:Joi.string()
	});
	return schema.validate(user);
}

module.exports =router;