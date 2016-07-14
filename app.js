'use strict'

var express    = require('express')
var bodyParser = require('body-parser')
var Promise    = require('bluebird')
var mongoose   = require('mongoose')
var Chevy      = require('./modules/chevy')

mongoose.connect('mongodb://localhost/chevy');

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
  var context = {
    query: '',
    postback: null,
    actions: [],
    completed: false,
    replies: []
  }

  var messaging_events = req.body.entry[0].messaging
  for (var i = 0; i < messaging_events.length; i++) {
    var event = req.body.entry[0].messaging[i]
    var sender = event.sender.id
    if (event.message && event.message.text) {
      context.query = event.message.text
    }
    else if (event.postback && event.postback.payload) {
      context.postback = event.postback
    }
    // no message or postback given
    else {
      continue
    }
    Chevy.think(context)
    .then(function(context) {
      return Chevy.reply(sender, context.replies)
    })
    .catch(function(err) {
      console.log(err)
      return Chevy.reply(sender, [{text: "Something went wrong, please try again!"}])
    })
  }

  res.sendStatus(200)
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
      return res.send(req.query['hub.challenge'])
  }
  res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
  console.log('running on port', app.get('port'))
})
