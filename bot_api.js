// Bot api utility to interpret the user input
const axios = require('axios');
var bot_api = function () {};

// Function to send a request to wit.ai and get the interpreted response
bot_api.prototype.read_msg = function(msg) {
    // Setting the request

    const AuthStr = 'Bearer '+'LJ2XFGQUSYDQS476PQHYEQIPW7RJCLA7'; 
    const URL = 'https://api.wit.ai/message?v=15/02/2018&q='+msg;
    axios.get(URL, { headers: { Authorization: AuthStr } })
    .then(response => {
         // If request is good...
         console.log(response.data.entities);
    })
    .catch((error) => {
         console.log('error ' + error);
    });
}

module.exports = new bot_api();