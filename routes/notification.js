const FCM = require('fcm-node');
const serverKey = config.get('fcmServerKey');
const fcm = new FCM(serverKey)

const deviceToken = "123";


const noti_title="testing";
const noti_body="this is the message"

const data_title="secretd title";
const data_body ="secret body";

const message = {
	to:deviceToken,
	notification:{
	title:noti_title,
	body:noti_body
	},
	//can send notification or only data as some update related and for what user appear

	data:{
		title:data_title,
		body:data_body
	}
}

fcm.send(message,function(err,response){
	if(err){
		console.log("something went wrong "+err);
		console.log("response:"+response);
	}else{
		console.log("Succesfully sent with response")
	}
});


let user = await User.find({PhoneNumber:req.body.ReceiverPhoneNumber);//for token regeneration hence not one lien do
	if(!user) {
		//send SMS
	}else{
		//send Notification
	}


/*
Save token(can be done in update profile)
Send Notification

Search Token
Create Message

Send Notification 
or SMS

Send Local
Send server Chat
Send Marketing
Send Update or background notification

Send to 1
Send to channel 
Send to all
Send to choosen ones

transaction add/update/
otp also ,no need to read sms rather notificaton eead background or dont do as security reasons

*/
