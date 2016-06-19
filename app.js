'use strict'

var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var Promise = require('bluebird')
var graph = require('fbgraph')
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

app.get('/test', function(req, res) {
  graph.setAccessToken('EAACEdEose0cBAKKv41m7CLvh0n4UraZAnkzGJahTeNd8vUgcc4qZArZBpYl1NrZCO0P1a53ENk5kHZCSh6s0dfiqdXrFvY3pZCnGtzxcC6l0wvV6feYwZCXtZBmMZAVhWO0j3jlk5N72rU1jpVUe7MsZCV8bI3yZBfc6GPeQS2PoFM3IQZDZD')
  var graphObject = graph.get('372772186164295/feed', function(err, res) {
    console.log(res)
  })
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
    Chevy.think(context)
    .then(function(context) {
      Chevy.reply(sender, context.replies)
    })
  }

  res.sendStatus(200)
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
      res.send(req.query['hub.challenge'])
  }
  res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
  console.log('running on port', app.get('port'))
})
