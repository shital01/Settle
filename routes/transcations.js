const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const dbDebugger = require('debug')('app:db');

const {Transcation,validate} = require('../models/transcation');
const {User} = require('../models/user');
const auth =require('../middleware/auth');

router.get('/',async(req,res)=>{
	
	try{
	const transcations = await Transcation
	.find()
	.populate('senderID','name -_id' )
	.populate('receiverID')
	//.find({senderName:'jay',isloan:true})
	//^jay?
	//.find({Amount:10})
	//.find({Amount:{$gt:10,$lte:40}})
	//{$in :[10,15,20]}
	//.or([{senderName:'jay'},{isloan:true}])
	//.count()
	//pageNumber,pageSize from query parms....
	//skip((pageNumber-1)*pageSize)
	//limit(pageSize)
	//.limit(10)
	
	//.sort({senderName:1})
	//.select({senderName:1,Amount:1});
	dbDebugger(transcations);
	res.send(transcations);
		}
	catch(ex){
		dbDebugger(ex.message);
		res.status(400).send(ex.message);

		//for(field in ex.errors) this to do in validate part,return is must otherwise no point of try catch forever stuck in this loop
		//	dbDebugger(ex.errors[field].message);
	}
});

//Modified
router.get('/:id',async(req,res)=>{
	
	try{
	const transcations = await Transcation
	.find({_id:req.params.id})
	//.find({senderName:'jay',isloan:true})
	//^jay?
	//.find({Amount:10})
	//.find({Amount:{$gt:10,$lte:40}})
	//{$in :[10,15,20]}
	//.or([{senderName:'jay'},{isloan:true}])
	//.count()
	//pageNumber,pageSize from query parms....
	//skip((pageNumber-1)*pageSize)
	//limit(pageSize)
	//.limit(10)
	
	//.sort({senderName:1})
	//.select({senderName:1,Amount:1});
	dbDebugger(transcations);
	res.send(transcations);
		}
	catch(ex){
		dbDebugger(ex.message);
		res.status(400).send(ex.message);

		
	}
});


//Modified-but mongodb error to handle
router.post('/',auth,async(req,res)=>{
	const result = validate(req.body);
	console.log(result);
	if(result.error){
		res.status(400).send(result.error.details[0].message);
		return;
	}
	const transcation = new Transcation({
		senderName:req.body.senderName,
		receiverName:req.body.receiverName,
		senderID:req.body.senderID,
		receiverID:req.body.receiverID,
		Amount:req.body.Amount,
		isloan:req.body.isloan
	});	
	const output = await transcation.save();
	res.send(output);
});


router.put('/:id',async(req,res)=>{
	//Lookup course if not 404
	//validate invalid 400-Bad request
	const result = validateTranscation(req.body);
	console.log(result);
	if(result.error){
		res.status(400).send(result.error.details[0].message);
		return;
	}
	//Update transcation and return new transcation

	//Query first findbyId()...modify and save()--if any coniditoin before update
	//update first optional to get updated document....if not need then this 
	const transcation = await Transcation.findById(id);
	if(!transcation) return;
	transcation.Amount = req.body.Amount;
	const mresult = await transcation.save();
	dbDebugger(mresult);
	res.send(mresult);


});

//Modified-handle mongodb error ,also 404 error handle
router.delete('/:id',async(req,res)=>{
	//Lookup course if not 404
	//Delete,Return that object
	const result =await Transcation.findByIdAndRemove(req.params.id);
	//result null if no object found
	dbDebugger(result);
	res.send(result);
	});


module.exports =router;