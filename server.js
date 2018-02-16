const express = require('express');
const bot_api = require('./bot_api.js');
const loki    = require('lokijs');

const app = express();
const port = process.env.PORT || 5000;

// Creating the lokijs logs db
var db            = new loki('logs.json');
var conversations = db.addCollection('conversations')

// Main app endpoint - Answr the questions to the bot
app.get('/messages/read', (req, res) => {
  var msg = req.query.msg;
 
  // Getting the wit response
  bot_api.read_msg(msg).then(answer => {
    // logging the message
    var ip  = req.connection.remoteAddress;
    conversations.insert({ip:ip, msg: msg,answer:answer});

    // Sending the answer
    res.send({ answer: answer });
  });
});

// Conversation session log
app.get('/messages/get', (req, res) => {
  var msg = req.query.msg;
  var ip  = req.connection.remoteAddress;
  
  var log = conversations.find( {'ip':ip} );
  res.send({ log: log });
});


app.listen(port, () => console.log(`Listening on port ${port}`));