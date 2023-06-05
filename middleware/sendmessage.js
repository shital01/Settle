const axios = require("axios");
const config = require('config');

async function sendmessage(send_to, message) {
    const urlencodedmessage = encodeURIComponent(message);
    const options = {
      method: 'POST',
      url: 'https://enterprise.smsgupshup.com/GatewayAPI/rest',
      data: {
        method: 'sendMessage',
        send_to: send_to,
        msg: urlencodedmessage,
        msg_type: 'TEXT',
        userid: config.get('userid'),
        auth_scheme: 'PLAIN',
        password: config.get('password'),
        format: 'JSON',
      },
    };



const response = await axios(options);
    if (response.status === 200) {
    	console.log(response);
      console.log('Message sent successfully');
      return true;
    } 
}

module.exports = sendmessage;

