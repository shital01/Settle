const request = require('supertest');
const mongoose = require('mongoose');

const {User} = require('../../models/user');

let server;
describe('/api/users',()=>{
	beforeEach(()=>{server = require('../../index')})
	afterEach(async()=>{
		await User.deleteMany({});
		await server.close();
		});	
	describe('Update user profile/',()=>{
		let token,token2;
		let Name,Profile,payload;
		const exec = () => {
			return  request(server)
			.put('/api/users/UpdateProfile')
			.set('x-auth-token',token)
			.send(payload)
		}
		beforeEach(async()=>{
			const user = new User({PhoneNumber:"1234123412",Name:"123"})
			await user.save()
			token = user.generateAuthToken();
			const user2 = new User({PhoneNumber:"1231231231",Name:"123123"})
			//await user2.save()
			token2 = user2.generateAuthToken();
			Name = "name2";
			Profile ="imageurl"
			payload={Name,Profile};
		})
		afterEach(async()=>{
			//await User.deleteMany({});
		})
		//Path-01
		it('should return 401 if no token provided',async()=>{
			token='';
			const res = await exec();
			expect(res.status).toBe(401);
			expect(res.body.response).toBe(null);

		})
		
		it('should return 400 if invalid token ',async()=>{
			token="123"
			const res = await exec();
			expect(res.status).toBe(400);
			expect(res.body.response).toBe(null);

		})
		//Path-3
		/*
		it('should return 400 if validation fail due to name ',async()=>{
			Name = '';
			payload={Name};
			const res = await exec();
			expect(res.status).toBe(400);	
			expect(res.body.response).toBe(null);

		})

		//Path-4
		it('should return 400 if validation fail due to profile ',async()=>{
			Profile = 1;
			payload = {Profile};
			const res = await exec();
			expect(res.status).toBe(400);
			expect(res.body.response).toBe(null);

		})
		*/
		//Path-05 check what code
		it('should return 400  if user is not exits  ',async()=>{
			token=token2
			const res = await exec();
			expect(res.status).toBe(400);
			expect(res.body.response).toBe(null);

		})
		//Path-06
		it('should return save  if user is saved to do this ',async()=>{
			const res = await exec();
			expect(res.status).toBe(200);
			expect(res.body.error).toBe(null);

			expect(Object.keys(res.body.response)).toEqual(
				expect.arrayContaining(['Name']))
		})	
	})
	//For friend Profile pic url
	describe('FriendProfile/',()=>{
		let token;
		let PhoneNumber;
		const exec = () => {
			return  request(server)
			.post('/api/users/FriendProfile')
			.set('x-auth-token',token)
			.send({PhoneNumber})
		}
		beforeEach(async()=>{
			const user = new User({PhoneNumber:"1234123412",Name:"name1",Profile:"imageurl"})
			await user.save()
			token = user.generateAuthToken();
			const user2 = new User({PhoneNumber:"1234123410",Name:"name1"})
			await user2.save()
			PhoneNumber = "1234123412";
		})
		afterEach(async()=>{
			//await User.deleteMany({});
		})
		//Path-01
		it('should return 401 if not logged in',async()=>{
			token='';
			const res = await exec();
			expect(res.status).toBe(401);
			expect(res.body.response).toBe(null);

		})
		//Path-02
		it('should return 400 if invalid token ',async()=>{
			token="123"
			const res = await exec();
			expect(res.status).toBe(400);
			expect(res.body.response).toBe(null);
		})
		//Path-03
		it('should return 400 if validation fail  ',async()=>{
			PhoneNumber = "1"
			const res = await exec();
			expect(res.status).toBe(400);
			expect(res.body.response).toBe(null);
		})
		//Path-04
		it('should return 400  if user doesnt exits ',async()=>{
			PhoneNumber="1231231231";
			const res = await exec();
			expect(res.status).toBe(400);
			expect(res.body.response).toBe(null);
		})	
		//Path-05
		it('should return 400  if no profile url ',async()=>{
			PhoneNumber="1234123410";
			const res = await exec();
			expect(res.status).toBe(400);
			expect(res.body.response).toBe(null);
		})
		//Path-06
		it('should return Profileurl  if user is have a picture uploaded',async()=>{
			const res = await exec();
			expect(res.status).toBe(200);
			expect(res.body.error).toBe(null);
			//expect(res.body).toEqual(expect.any(String));
			expect(Object.keys(res.body.response)).toEqual(
				expect.arrayContaining(['Profile']))
		
		})		
	})

	//For friends Profile pic url
	describe('FriendsProfile/',()=>{
		let token;
		let PhoneNumber,PhoneNumbers;
		const exec = () => {
			return  request(server)
			.post('/api/users/FriendsProfile')
			.set('x-auth-token',token)
			.send({PhoneNumbers})
		}
		beforeEach(async()=>{
			const user = new User({PhoneNumber:"1234123411",Name:"name1",Profile:"imageurl"})
			await user.save()
			const user1 = new User({PhoneNumber:"1234123412",Name:"name2",Profile:"imageurl2"})
			await user1.save()
			token = user.generateAuthToken();
			const user2 = new User({PhoneNumber:"1234123410",Name:"name1"})
			await user2.save()
			PhoneNumber = "1234123412";
			PhoneNumbers =["1234123412","1234123411"];
		})
		afterEach(async()=>{
			//await User.deleteMany({});
		})
		//Path-01
		it('should return 401 if not logged in',async()=>{
			token='';
			const res = await exec();
			expect(res.status).toBe(401);
			expect(res.body.response).toBe(null);
		})
		//Path-02
		it('should return 400 if invalid token ',async()=>{
			token="123"
			const res = await exec();
			expect(res.status).toBe(400);
			expect(res.body.response).toBe(null);
		})
		//Path-03
		it('should return 400 if validation fail  ',async()=>{
			PhoneNumbers = ["1"]
			const res = await exec();
			expect(res.status).toBe(400);
			expect(res.body.response).toBe(null);
		})
		//Path-04
		it('should return 400  if user doesnt exits ',async()=>{
			PhoneNumbers=["1231231233"]
			const res = await exec();
			expect(res.status).toBe(400);
			expect(res.body.response).toBe(null);
		})	
		//Path-05
		
		/*it('should return 400  if no profile url ',async()=>{
			PhoneNumbers=["1234123410"];
			const res = await exec();
			expect(res.status).toBe(400);
		})*/
		//Path-06
		it('should return Profileurl  if user is have a picture uploaded',async()=>{
			const res = await exec();
			expect(res.status).toBe(200);
			expect(res.body.error).toBe(null);
			//expect(res.body).toEqual(expect.any(String));
			//expect(Object.keys(res.body)).toEqual(
			//	expect.arrayContaining(['Profile']))
		
		})		
	})




})


