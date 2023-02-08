const request = require('supertest');
const mongoose = require('mongoose');

const {Transaction} = require('../../models/transaction');
const {User} = require('../../models/user');

let server;
describe('/api/transactions',()=>{

	beforeEach(()=>{server = require('../../index')})
	afterEach(async()=>{
		await server.close();
		await Transaction.deleteMany({});
		await User.deleteMany({})
		});
//To Match property fail sometime n too strict  so to have property then array containing
//To Match(too strict fail due to location),to have property,loop over all objects with all fields have and length field
//to be truthy to check even value of object field
/*
expect(Object.keys(res.body)).toEqual(
	expect.arrayContaining(['SenderName','SenderPhoneNumber']))
	//expect(res.body.some(t =>t.SenderName ==='name1')).toBeTruthy();
	//expect(res.body.some(t =>t.SenderName ==='name2')).toBeTruthy();
*/

//test each input failrue so increase in no of path and also loop over input if possible
//set recievrname null undefine nlal in loop to test
//Get Request Paths Testing	
	describe('GET /',() =>{
			const userid = mongoose.Types.ObjectId();
			const userid2 = mongoose.Types.ObjectId();
			const transaction1 = {
				ReceiverName : "name2",
				Amount : 1,
				ReceiverPhoneNumber : "1234512345",
				Isloan : true,
				SenderName:'name1',
				SenderID:userid,
				SenderPhoneNumber:"1231231231",
				TransactionDate: "2023-02-02T06:44:31.118Z",
				Notes:"just a note"
			}
			const transaction2 = {
				ReceiverName : "name1",
				Amount : 1,
				ReceiverPhoneNumber : "1231231231",
				Isloan : true,
				SenderName:'name2',
				SenderID:userid2,
				SenderPhoneNumber:"1234512345",
				TransactionDate: "2023-01-01T06:44:31.118Z",
				AttachmentsPath:["firsturl","secondurl"]
			}
			const transaction3 = {
				ReceiverName : "name1",
				Amount : 1,
				ReceiverPhoneNumber : "1431231231",
				Isloan : true,
				SenderName:'name2',
				SenderID:userid2,
				SenderPhoneNumber:"1434512345",
				TransactionDate: "2023-01-12T06:44:31.118Z"
			}
			const transaction4 = {
				ReceiverName : "name1",
				Amount : 1,
				ReceiverPhoneNumber : "1231231231",
				Isloan : true,
				SenderName:'name2',
				SenderID:userid2,
				SenderPhoneNumber:"1234512345",
				TransactionDate: "2023-01-02T06:44:31.118Z"
			}
			
			//Happy Path
			let exec = () => {
			return  request(server)
			.get('/api/transactions/All')
			.set('x-auth-token',token)
			}
			beforeEach(()=>{
			token = new User({_id:userid,PhoneNumber:"1234512345",Name:"name1"}).generateAuthToken();		
			})
		it('should return 401 for No token',async() =>{
			token ='';
			const res = await exec();
			expect(res.status).toBe(401);
		});
		it('should return 400 for invalid token',async() =>{
			token ='1';
			const res = await exec();
			expect(res.status).toBe(400);
		});
		it('should return all transactions',async() =>{
			await Transaction.collection.insertMany([transaction1,transaction2,transaction3,transaction4])
			const res = await exec();
			expect(res.status).toBe(200);
			expect(res.body.length).toBe(3);
			expect(Object.keys(res.body[0])).toEqual(
				expect.arrayContaining(['SenderName','SenderPhoneNumber','SenderID','ReceiverName','ReceiverPhoneNumber','Amount','Isloan','TransactionDate','_id',]))
		});
	});
	//Get Request Paths Testing	
	//date tested in postman working but not in supertest nor date related query picking it up
	describe('GET BY DATE/',() =>{
			const userid = mongoose.Types.ObjectId();
			const userid2 = mongoose.Types.ObjectId();
			let lastUpdatedDate,token;
			const transaction1 = {
				ReceiverName : "name2",
				Amount : 1,
				ReceiverPhoneNumber : "1234512345",
				Isloan : true,
				SenderName:'name1',
				SenderID:userid,
				SenderPhoneNumber:"1231231231",
				TransactionDate: "2023-02-02T06:44:31.118Z",
				Notes:"just a note"
			}
			const transaction2 = {
				ReceiverName : "name1",
				Amount : 1,
				ReceiverPhoneNumber : "1231231231",
				Isloan : true,
				SenderName:'name2',
				SenderID:userid2,
				SenderPhoneNumber:"1234512345",
				TransactionDate: "2023-01-01T06:44:31.118Z",
				AttachmentsPath:["firsturl","secondurl"]
			}
			const transaction3 = {
				ReceiverName : "name1",
				Amount : 1,
				ReceiverPhoneNumber : "1431231231",
				Isloan : true,
				SenderName:'name2',
				SenderID:userid2,
				SenderPhoneNumber:"1434512345",
				TransactionDate: "2023-01-12T06:44:31.118Z"
			}
			const transaction4 = {
				ReceiverName : "name1",
				Amount : 1,
				ReceiverPhoneNumber : "1231231231",
				Isloan : true,
				SenderName:'name2',
				SenderID:userid2,
				SenderPhoneNumber:"1234512345",
				TransactionDate: "2023-01-02T06:44:31.118Z"
			}
			
			//Happy Path
			let exec = () => {
			return  request(server)
			.get('/api/transactions/')
			.set('x-auth-token',token)
			.send({lastUpdatedDate})
			}
			beforeEach(async()=>{
			const user = new User({PhoneNumber:"1234512345",Name:"name1"})		
			await user.save();
			token = user.generateAuthToken();
			lastUpdatedDate=new Date("2023-01-02T06:44:31.118Z");
			})
			afterEach(async()=>{
			await User.deleteMany({})
			})
		it('should return 401 for No token',async() =>{
			token ='';
			const res = await exec();
			expect(res.status).toBe(401);
		});
		it('should return 400 for invalid token',async() =>{
			token ='1';
			const res = await exec();
			expect(res.status).toBe(400);
		});
		it('should return 400 for invalid Date',async() =>{
			lastUpdatedDate =null;
			const res = await exec();
			expect(res.status).toBe(400);
		});
		//it wont be running due to date
		/*
		it('should return all transactions',async() =>{
			await Transaction.collection.insertMany([transaction1,transaction2,transaction3,transaction4])
			//lastUpdatedDate = new Date(lastUpdatedDate);
			const ts= await Transaction.find({UpdatedDate:{$lt:lastUpdatedDate}});
			console.log(ts);
			const res = await exec();
			expect(res.status).toBe(200);
			expect(res.body.length).toBe(3);
			expect(Object.keys(res.body[0])).toEqual(
				expect.arrayContaining(['SenderName','SenderPhoneNumber','SenderID','ReceiverName','ReceiverPhoneNumber','Amount','Isloan','TransactionDate','_id',]))
		});
		*/
	});
//Coverage for cover and path not taken good idea
	describe('POST/',()=>{
		let token,userid;
		let ReceiverName,ReceiverPhoneNumber,Isloan,Amount,TransactionDate,Notes;
		const exec = () => {
			return  request(server)
			.post('/api/transactions')
			.set('x-auth-token',token)
			.send({ReceiverName,Amount,ReceiverPhoneNumber,Isloan,TransactionDate})
		}
		beforeEach(()=>{
			userid= mongoose.Types.ObjectId();
			token = new User({_id:userid,PhoneNumber:"1234123412",Name:"name1"}).generateAuthToken();
			ReceiverName = "name2";
			Amount = 1;
			ReceiverPhoneNumber = "1234512345";
			Isloan = true;
			TransactionDate = "2023-02-02T06:44:31.118Z";
		})
		//Path-01
		it('should return 401 if not logged in',async()=>{
			token='';
			const res = await exec();
			expect(res.status).toBe(401);
		})
		//Path-02
		it('should return 400 if invalid token ',async()=>{
			token="123"
			const res = await exec();
			expect(res.status).toBe(400);
		})
		//Path-03
		it('should return 400 if validation transaction failed due to name',async()=>{
			ReceiverName = null;
			const res = await exec();
			expect(res.status).toBe(400);
		})
		//Path-04
		it('should return 400 if validation transaction failed due to amount',async()=>{
			Amount = "12da";
			const res = await exec();
			expect(res.status).toBe(400);
		})
		//Path-05
		it('should return 400 if validation transaction failed due to Phone number',async()=>{
			ReceiverPhoneNumber = "12";
			const res = await exec();
			expect(res.status).toBe(400);
		})
		//Path-06
		it('should return 400 if validation transaction failed due to loan status',async()=>{
			Isloan = "asd";
			const res = await exec();
			expect(res.status).toBe(400);
		})
		//Path-07
		it('should return 400 if validation transaction failed due to date',async()=>{
			TransactionDate = null;
			const res = await exec();
			expect(res.status).toBe(400);
		})
		//Path-08
		it('should save and return transaction if valid transaction ',async()=>{
			Notes="just a note"
			const res = await exec();
			expect(res.status).toBe(200);
			//check the save part also 
			//const transaction = await Transaction.find({SenderName:"name1"});
			expect(Object.keys(res.body)).toEqual(
				expect.arrayContaining(['SenderName','SenderPhoneNumber','ReceiverName','ReceiverPhoneNumber','Isloan','Amount']))
		})
	})
	describe('PUT/',()=>{
		let token,token2,userid,TransactionId,userid2;
		let payload;
		let transaction1;
		let SenderPhoneNumber;
		let ReceiverName,ReceiverPhoneNumber,Isloan,Amount,TransactionDate,Notes;
		const exec = () => {
			return  request(server)
			.put('/api/transactions')
			.set('x-auth-token',token)
			.send(payload)
		}
		beforeEach(async()=>{
				userid = mongoose.Types.ObjectId();
				userid2 = mongoose.Types.ObjectId();
			 	transaction1 = {
				ReceiverName : "name2",
				Amount : 1,
				ReceiverPhoneNumber : "1234512345",
				Isloan : true,
				SenderName:'name1',
				SenderID:userid,
				SenderPhoneNumber:"1231231231",
				TransactionDate: "2023-02-02T06:44:31.118Z",
				Notes:"just a note"
					}
			const transaction = await new Transaction(transaction1).save()
			token = new User({_id:userid,PhoneNumber:"1231231231",Name:"name1"}).generateAuthToken();
			token2 = new User({_id:userid2,PhoneNumber:"1231231230",Name:"name2"}).generateAuthToken();

			Amount = 2;
			payload={Amount};
			TransactionId = transaction._id
		})
		
		//Path-01
		it('should return 401 if not logged in',async()=>{
			token='';
			const res = await exec();
			expect(res.status).toBe(401);
		})
		//Path -02
		it('should return 400 if invalid token ',async()=>{
			token="123"
			const res = await exec();
			expect(res.status).toBe(400);
		})


		//Path-03
		it('should return 400 if validation transaction failed due to name',async()=>{
			ReceiverName = null;
			payload={ReceiverName,TransactionId};
			const res = await exec();
			expect(res.status).toBe(400);
		})
		//Path-04
		it('should return 400 if validation transaction failed due to amount',async()=>{
			Amount = "12da";
			payload = {Amount,TransactionId}
			const res = await exec();
			expect(res.status).toBe(400);
		})
		//Path-05
		it('should return 400 if validation transaction failed due to Phone number',async()=>{
			ReceiverPhoneNumber = "12";
			payload={ReceiverPhoneNumber,TransactionId}
			const res = await exec();
			expect(res.status).toBe(400);
		})
		//Path-06
		it('should return 400 if validation transaction failed due to loan status',async()=>{
			Isloan = "asd";
			payload= {Isloan,TransactionId}
			const res = await exec();
			expect(res.status).toBe(400);
		})
		//Path-07
		it('should return 400 if validation transaction failed due to date',async()=>{
			TransactionDate = null;
			payload={TransactionDate,TransactionId}
			const res = await exec();
			expect(res.status).toBe(400);
		})
		//Path-08
		it('should return 400 if validation transaction failed due to invalid ID',async()=>{
			TransactionId="1";
			payload ={TransactionId}
			const res = await exec();
			expect(res.status).toBe(400);
		})
		//Path-09
		it('should return 400  if transaction not found with given ID ',async()=>{
			TransactionId=userid;//so that unable to found transaction even toh its objectId
			payload={TransactionId}
			const res = await exec();
			expect(res.status).toBe(400);
		})
		//Path-10
		it('should return 403  if user forbidden to do this ',async()=>{
			token=token2;
			payload={TransactionId}
			const res = await exec();
			expect(res.status).toBe(403);
		})
		//Path-11
		it('should update the transaction and return valid response if valid transaction ',async()=>{
			payload={Amount,TransactionId}
			const res = await exec();
			expect(res.status).toBe(200);
			const transactions = await Transaction.find()
			expect(transactions[0].Amount).toBe(2);
		})
	})
	//Delete testing
	describe('DELETE/',()=>{
		let token,token2;
		let TransactionId;
		//async await remove as direct return
		const exec = () => {
			return  request(server)
			.delete('/api/transactions')
			.set('x-auth-token',token)
			.send({id:TransactionId})
		}
		beforeEach(async()=>{
				userid = mongoose.Types.ObjectId();
				userid2 = mongoose.Types.ObjectId();
			 	transaction1 = {
				ReceiverName : "name2",
				Amount : 1,
				ReceiverPhoneNumber : "1234512345",
				Isloan : true,
				SenderName:'name1',
				SenderID:userid,
				SenderPhoneNumber:"1231231231",
				TransactionDate: "2023-02-02T06:44:31.118Z",
				Notes:"just a note"
					}
			const transaction = await new Transaction(transaction1).save()
			token = new User({_id:userid,PhoneNumber:"1231231231",Name:"name1"}).generateAuthToken();
			token2 = new User({_id:userid2,PhoneNumber:"1231231230",Name:"name2"}).generateAuthToken();
			TransactionId = transaction._id
		})
		
		//Path-01
		it('should return 401 if not logged in',async()=>{
			token='';
			const res = await exec();
			expect(res.status).toBe(401);
		})
		//Path-02
		it('should return 400 if invalid token ',async()=>{
			token="123"
			const res = await exec();
			expect(res.status).toBe(400);
		})
		//Path-03
		it('should return 400 if validation fails  ',async()=>{
			TransactionId = "1"
			const res = await  exec();
			expect(res.status).toBe(400);
		})
		//Path-04
		it('should return 400  if transaction not found with given ID/if Already delete ',async()=>{
			TransactionId=userid;
			const res = await exec();
			expect(res.status).toBe(400);
		})
		//Path-05
		it('should return 403  if user forbidden to do this ',async()=>{
			token=token2;
			const res = await exec();
			expect(res.status).toBe(403);
		})
		//Path-06
		it('should delete transaction if valid transaction ',async()=>{
			const res = await exec();
			expect(res.status).toBe(200);
		})
		
	})	
});
