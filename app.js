var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
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

var token = "CAARZAXuMIOewBAJo3VjIFfUOpuck1IW5AEymxMzrMkXNjMRsIlVR4wBhqibvh1M1xvOhxFcrR6C35yShzxzhyRRqrAo4hLzsrdXDuneRKeSRLPggL8BDMk0QIRO9OAIHtz1qOVrSRVxX4ji6j1e4SZC7CE2qE3YiwVjWNNb13sJFOLpsLk4WYzZCyrGLGgZD"

function sendTextMessage(sender, text) {
    messageData = {
        text:text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
        console.log('Successful POST to Facebook API')
    })
}

app.post('/webhook/', function (req, res) {
    messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        console.log('Event: ', event)
        sender = event.sender.id
        console.log('Sender id: ', sender)
        if (event.message && event.message.text) {
            text = event.message.text
            sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
        }
    }
    res.sendStatus(200)
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})
