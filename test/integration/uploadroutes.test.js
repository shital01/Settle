const request = require('supertest');
const mongoose = require('mongoose');
const {User} = require('../../models/user');

let server;
describe('/api/upload routes',()=>{
	beforeEach(()=>{server = require('../../index')})
	afterEach(async()=>{
		await server.close();
		await User.deleteMany({});
		});
	describe('GET /',() =>{
			let userid,token;
			userid = mongoose.Types.ObjectId();
			//Happy Path
			let exec = () => {
			return  request(server)
			.get('/api/UploadURLRequest/')
			.set('x-auth-token',token)
			}
			beforeEach(async()=>{
				token = new User({_id:userid,PhoneNumber:"1231231231",Name:"name1"}).generateAuthToken();

			})
		it('should return 401 for No token',async() =>{
			token ='';
			const res = await exec();
			expect(res.status).toBe(401);
			expect(res.body.response).toBe(null);

		});
		it('should return 400 for invalid token',async() =>{
			token ='1';
			const res = await exec();
			expect(res.status).toBe(400);
			expect(res.body.response).toBe(null);

		});
		it('should return URL',async() =>{
			const res = await exec();
			//console.log(res.body.key+res.body.url)
			expect(res.status).toBe(200);
			expect(res.body.error).toBe(null);

			//Put check on return type key and url as contain userid
		});
	});

})