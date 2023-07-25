const express = require('express');
//instead of app word router is used
const router = express.Router();
const Joi = require('joi');
const config = require('config');
const {User} = require('../models/user');
const {Transaction} = require('../models/transaction');

const authorization =require('../middleware/authorization');
const dbDebugger = require('debug')('app:db');

router.get('/GetUsers',async(req,res)=>{
	let users = await User.find({},{Name:1,PhoneNumber:1});//for token regeneration hence not one lien do
	res.header().send({error:null,response:users});
});


router.get('/GetTransactions',async(req,res)=>{
	let users = await Transaction.find({},{SenderName:1,ReceiverName:1,Amount:1,Notes:1});//for token regeneration hence not one lien do
	res.header().send({error:null,response:users});
});

router.get('/TotalUsers',async(req,res)=>{
	let users = await User.count();
	res.header().send({error:null,response:users});
});


router.get('/TotalTransactions',async(req,res)=>{
	let users = await Transaction.count();
	res.header().send({error:null,response:users});
});
module.exports =router;