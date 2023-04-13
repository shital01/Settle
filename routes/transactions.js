const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const dbDebugger = require('debug')('app:db');
const {Transaction,validate,validateDeleteTransaction,validateUpdateTransaction,validateRequestTransaction} = require('../models/transaction');
const {User} = require('../models/user');
const auth =require('../middleware/auth');
/*
Input->lastUpdatedDate(Date format and date of latest entry) along with auth token
Output->Objects of Transactions in sorted order
Procedure->Query Using Phone Number and date to get info of transaction which are related to particular user and 
*/
router.put('/fetchtransactions',auth,async(req,res)=>{
	//throw new Error("hello")

	const lastUpdatedDate = req.body.lastUpdatedDate;
	const result = validateRequestTransaction(req.body);
	if(result.error){
		dbDebugger(result.error.details[0].message)
		res.status(400).send({error:result.error.details[0],response:null});
		return;
	}
		//watch performance of this
	const PhoneNumber = req.user.PhoneNumber;
	const transactions = await Transaction
	.find({$and:[{$or:[{SenderPhoneNumber:{$eq: PhoneNumber}},{ReceiverPhoneNumber:{$eq: PhoneNumber}}]},{UpdatedDate:{$gt:lastUpdatedDate}}]})//watch performance of this
	//.sort({Date:1})
	//dbDebugger(transactions);
	res.send({error:null,response:transactions});
		
});

/*
Input->Auth token
Output->Objects of Transactions in sorted order
Procedure->Query Using Phone Number and date to get info of transaction which are related to particular user and 
*/
router.get('/All',auth,async(req,res)=>{
	const PhoneNumber = req.user.PhoneNumber;
	const transactions = await Transaction
	//watch performance of this
	.find({$or:[{SenderPhoneNumber:{$eq: PhoneNumber}},{ReceiverPhoneNumber:{$eq: PhoneNumber}}]})//watch performance of this
	//.sort({Date:1})
	//dbDebugger(transactions);
	res.send({error:null,response:transactions});
		
});

/*
Input->RecieverName(String),Isloan(String),RecieverPhoneNumber(10 digit String),Amount(Integer),AttachmentsPath(array of strings) whcih comes form key
send x-auth-token
Output->transaction Object
Procedure->validate header
validate input
save transaction
return saved object
*/
router.post('/',auth,async(req,res)=>{
	//get id and Number form user object so to imply safety (allowed Api and same time consistency of id as not from client)
	req.body.SenderID=req.user._id;
	req.body.SenderPhoneNumber = req.user.PhoneNumber;
	req.body.SenderName=req.user.Name;

	const result = validate(req.body);
	if(result.error){
		dbDebugger(result.error.details[0].message)
		res.status(400).send({error:result.error.details[0],response:null});
		return;
	}
		req.body.UpdatedDate=new Date(new Date().getTime()+330*60*1000);
	console.log(req.body.Isloan)
	if(!req.body.Isloan){req.body.Amount=-req.body.Amount}
	const transaction = new Transaction(req.body);
	const output = await transaction.save();
	res.send({error:null,response:output});
});
/*

Attach to firebase Account
Store Token
Exponent Try ?

To one ,to few,To channel,To All
parallel the code
*/


//find User token from ReceiverPhoneNumber
//Create NotificationMessage Body
//SendNotification

/*
Input->TransactionId(ObjectID),Amount(Integer).......
Output->New Transaction Object
Procedure->validate Inputs(otherwise 400 with message)
check if Transaction exits(400 with message)
check is user allwoed (403 with message)
update and return
*/
router.put('/',auth,async(req,res)=>{
	const result = validateUpdateTransaction(req.body);
	if(result.error){
		dbDebugger(result.error.details[0].message)
		res.status(400).send({error:result.error.details[0],response:null});
		return;
	}
	//Query first findbyId()...modify and save()--if any coniditoin before update
	//update first optional to get updated document....if not need then this 
	const transaction = await Transaction.findById(req.body.TransactionId);
	if(!transaction) return res.status(400).send({error:{message:'Transaction doesnot exits with given Id'},response:null});
	if(!transaction.SenderID.equals(req.user._id)) return res.status(403).send({error:{message:'Not Access for updating'},response:null});
	req.body.UpdatedDate=new Date(new Date().getTime()+330*60*1000);
	if('Isloan' in req.body){
		if(!req.body.Isloan){req.body.Amount=-transaction.Amount;}
		else{req.body.Amount=transaction.Amount;}
	}
	//findbyid and update return new or old nto normal update

	transaction.set(req.body)
	const mresult = await transaction.save();
	res.send({error:null,response:mresult});
});

/*
Input->Transaction id as parameter
send x-auth-token
Output->Transaction id of deleted object
Procedure->validate header
validate input
delete transaction check is it allowed?
return deleted object id  or validation error or if already deleted then 400 or if nto allowed then 403 
*/
router.delete('/',auth,async(req,res)=>{
	const result = validateDeleteTransaction({"TransactionId":req.body.id,"SenderID":req.user._id})
	if(result.error){
		dbDebugger(result.error.details[0].message)
		res.status(400).send({error:result.error.details[0],response:null});	
		return;
	}
	const result1 =await Transaction.findById(req.body.id);
	if(!result1) return res.status(400).send({error:{message:'Already Deleted Transaction'},response:null});
	if(!result1.SenderID.equals(req.user._id)) return res.status(403).send({error:{message:'Not Access for deleting'},response:null});
	result1.remove();
	res.send({error:null,response:result1});
	});


/*
Input->Transaction id as parameter
send x-auth-token
Output->Transaction id of deleted object
Procedure->validate header
validate input
delete transaction check is it allowed?
return deleted object id  or validation error or if already deleted then 400 or if nto allowed then 403 
*/
router.delete('/delete',auth,async(req,res)=>{
	const result = validateDeleteTransaction({"TransactionId":req.body.id,"SenderID":req.user._id})
	if(result.error){
		dbDebugger(result.error.details[0].message)
		res.status(400).send({error:result.error.details[0],response:null});		
		return;
	}
	const result1 =await Transaction.findById(req.body.id);
	if(!result1) return res.status(400).send('Already Deleted Transaction');
	if(!result1.SenderID.equals(req.user._id)) return res.status(403).send({error:{message:'Not Access for deleting'},response:null});
	result1.deleteFlag=true;
	result1.UpdatedDate=new Date(new Date().getTime()+330*60*1000);
	//findbyid and update return new or old nto normal update
	const mresult = await result1.save(req.body);
	res.send({error:null,response:mresult});


	//result1.remove();
	//res.send(result1);
	});





module.exports =router;


/*
// This registration token comes from the client FCM SDKs.
const registrationToken = 'YOUR_REGISTRATION_TOKEN';
//message.data,message.notification.title,message.notification.body
const message = {
  data: {
    score: '850',
    time: '2:45'
  },
  token: registrationToken
};

// Send a message to the device corresponding to the provided
// registration token.
getMessaging().send(message)
  .then((response) => {
    // Response is a message ID string.
    console.log('Successfully sent message:', response);
  })
  .catch((error) => {
    console.log('Error sending message:', error);
  });
  */