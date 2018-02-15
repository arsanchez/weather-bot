const express = require('express');
const bot_api = require('./bot_api.js');

const app = express();
const port = process.env.PORT || 5000;

app.get('/messages/read', (req, res) => {
  var msg = req.param("msg");
  // Getting the wit response
  bot_api.read_msg(msg);
  res.send({ answer: msg });
});

app.listen(port, () => console.log(`Listening on port ${port}`));