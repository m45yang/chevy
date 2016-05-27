'use strict'

var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var Chevy = require('./modules/chevy')

var app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
  res.send('Hello world, I am a chat bot')
})

app.post('/webhook/', function (req, res) {
  var messaging_events = req.body.entry[0].messaging
  for (var i = 0; i < messaging_events.length; i++) {
      var event = req.body.entry[0].messaging[i]
      var sender = event.sender.id
      if (event.message && event.message.text) {
          var text = event.message.text
          var response = Chevy.think(text)
          Chevy.sendMessage(sender, response.substring(0, 200))
      }
  }
  res.sendStatus(200)
})

// for Facebook verification
// app.get('/webhook/', function (req, res) {
//   if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
//       res.send(req.query['hub.challenge'])
//   }
//   res.send('Error, wrong token')
// })

// Spin up the server
app.listen(app.get('port'), function() {
  console.log('running on port', app.get('port'))
})
