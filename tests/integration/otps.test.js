const request = require('supertest');
const {Otp} = require('../../models/otp');
const bcrypt = require('bcrypt');
const {User} = require('../../models/user');
const mongoose = require('mongoose');
let server;
describe('/api/otps',()=>{

	beforeEach(()=>{server = require('../../index')})
	afterEach(async()=>{
		//await Otp.remove({});
		await server.close();
		});

	describe('GET /',()=>{
		let PhoneNumber;
		const exec = () => {
			return  request(server)
			.post('/api/otps/GenerateOTP')
			.send({PhoneNumber})
		}
		beforeEach(()=>{
			PhoneNumber="1234512345";
		})
		//Path-01
		it('should return 400 if validation OTP failed due to invalid number',async()=>{
			PhoneNumber = "1";
			const res = await exec();
			expect(res.status).toBe(400);
		})
		//Path-02
		it('should save otp if valid otp ',async()=>{
			const res = await exec();
			expect(res.status).toBe(200);
		})
	})
	describe('POST/',()=>{
		let OTP;
		let PhoneNumber;
		let OTPhashed
		let PhoneNumber1,PhoneNumber2,PhoneNumber3
		const exec = () => {
			return  request(server)
			.post('/api/otps/VerifyOTP')
			.send({OTP,PhoneNumber})
		}
		beforeEach(async()=>{
			OTP = "1234";
			const salt = await bcrypt.genSalt(10);
			OTPhashed = await bcrypt.hash(OTP,salt)
			PhoneNumber1 = "1234567890";
			PhoneNumber2 = "1231231231";
			PhoneNumber3 = "1234512346";
		})
		afterEach(async()=>{
			await Otp.deleteMany({});
			await User.deleteMany({});
		})
		//Path-01
		it('should return 400 if validation OTP failed due to in valid PhoneNumber',async()=>{
			PhoneNumber="1";
			const res = await exec();
			expect(res.status).toBe(400);
		})
		//P2
		it('should return 400 if validation OTP failed due to OTP invalid',async()=>{
			OTP="1";
			PhoneNumber=PhoneNumber1;
			const res = await exec();
			expect(res.status).toBe(400);
		})
		//P3
		it('should return 404 if wrong OTP as not requested no entry and also new user',async()=>{
			await Otp.collection.insertMany([{PhoneNumber:PhoneNumber1,OTP:OTPhashed},{PhoneNumber:PhoneNumber2,OTP:OTPhashed}])
			PhoneNumber=PhoneNumber3;
			const res = await exec();
			expect(res.status).toBe(404);

		})
		//P-4
		it('should return 404 if wrong OTP and user is new ',async()=>{
			await Otp.collection.insertMany([{PhoneNumber:PhoneNumber1,OTP:OTPhashed},{PhoneNumber:PhoneNumber2,OTP:OTPhashed}])
			PhoneNumber=PhoneNumber1;
			OTP="1111";
			const res = await exec();
			expect(res.status).toBe(404);

		})
		//P-5
		it('should return 200 if correct OTP and user is new ',async()=>{
			await Otp.collection.insertMany([{PhoneNumber:PhoneNumber1,OTP:OTPhashed},{PhoneNumber:PhoneNumber2,OTP:OTPhashed}])
			PhoneNumber=PhoneNumber1;
			const res = await exec();
			expect(res.status).toBe(200);
			expect(Object.keys(res.body)).toEqual(
				expect.arrayContaining(['_id','PhoneNumber']))
			//Add more checks of return and user saved or not
			//Change header part also each info send

		})
		//P6
		it('should return 404 if wrong OTP as not requested no entry and also old user',async()=>{
			await Otp.collection.insertMany([{PhoneNumber:PhoneNumber1,OTP:OTPhashed},{PhoneNumber:PhoneNumber2,OTP:OTPhashed}])
			await User.collection.insertMany([{PhoneNumber:PhoneNumber1,Name:"name1"},{PhoneNumber:PhoneNumber3,Name:"name1"}])
			PhoneNumber=PhoneNumber3;
			const res = await exec();
			expect(res.status).toBe(404);

		})
		//P-7
		it('should return 404 if wrong OTP and user is old ',async()=>{
			await Otp.collection.insertMany([{PhoneNumber:PhoneNumber1,OTP:OTPhashed},{PhoneNumber:PhoneNumber2,OTP:OTPhashed}])
			await User.collection.insertMany([{PhoneNumber:PhoneNumber1,Name:"name1"},{PhoneNumber:PhoneNumber3,Name:"name1"}])

			PhoneNumber=PhoneNumber1;
			OTP="1111";
			const res = await exec();
			expect(res.status).toBe(404);

		})
		//P-8
		it('should return 200 if correct OTP and user is old ',async()=>{
			await Otp.collection.insertMany([{PhoneNumber:PhoneNumber1,OTP:OTPhashed},{PhoneNumber:PhoneNumber2,OTP:OTPhashed}])
			await User.collection.insertMany([{PhoneNumber:PhoneNumber1,Name:"name1"},{PhoneNumber:PhoneNumber3,Name:"name1"}])

			PhoneNumber=PhoneNumber1;
			const res = await exec();
			expect(res.status).toBe(200);
			expect(Object.keys(res.body)).toEqual(
				expect.arrayContaining(['_id','PhoneNumber']))
			//Add more checks of return and user saved or not
			//Change header part also each info send

		})
	})
})