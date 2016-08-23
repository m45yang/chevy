'use strict'

var express    = require('express')
var bodyParser = require('body-parser')
var Promise    = require('bluebird')
var mongoose   = require('mongoose')
var graph      = require('fbgraph')
var Chevy      = require('./modules/chevy')
var config     = require('./config')

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

      // Authorization error, send link to prompt user to use
      // the provided link to authorize Chevy
      if (err.type === 'OAuthException' && err.code === 190) {
        return Chevy.reply(sender, [
          { text: 'Please authorize Chevy to access the Waterloo Carpool page for you by clicking on this link!' },
          { text: config.authUrl }
        ])
      }
      else {
        return Chevy.reply(sender, [{ text: 'Something went wrong, please contact a developer!' }])
      }
    })
  }

  res.sendStatus(200)
})

// Endpoint to refresh a user's access token
app.get('/auth/facebook', function(req, res) {
  // Redirect to the Oauth dialog if code
  // is not provided
  if (!req.query.code) {
    var authUrl = graph.getOauthUrl({
      "client_id": config.clientId,
      "redirect_uri": config.authUrl
    })

    if (!req.query.error) {
      res.redirect(authUrl)
    } else {
      console.log(req.query.error)
      res.send('Access denied.')
    }
    return
  }

  // Use provided code to get access token
  graph.authorize({
    "client_id": config.clientId,
    "redirect_uri": config.authUrl,
    "client_secret": config.clientSecretKey,
    "code": req.query.code
  }, function (err, response) {
    // store the user access token somewhere
    console.log(response.access_token)
    res.redirect('/')
  })
})

// For Facebook verification
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
