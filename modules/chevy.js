'use strict'

var request = require('request')
var natural = require('natural')

class Chevy {
  constructor() {
    this.name = "Chevy"
    this.accessToken = "EAAV2U0FJIDIBAIYMoyqXYZAm1H5mzDdln4QElKzB9hCDm6iZBofwJh9ZBe6OwYT0nxHDqCDSFW4DKNQtMFEIcUXHZA1DSUxVZCZAcv1yTHKFAY0YQSVrmW7xpOLqXHScUxE1efZBm77bTintyw79i50iT9gvN4fsnmHMAey3vMv0QZDZD"

    // Regular expressions
    this.regex = {
      RIDE : /carpool|ride/i,
      DAY  : /today|tomorrow|tonight|tomorrow night/i
    }
  }

  // Replies the sender with text
  sendMessage(sender, text) {
    var messageData = {
      text:text
    }
    request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: { access_token : this.accessToken },
      method: 'POST',
      json: {
          recipient: { id : sender },
          message: messageData,
      }
    },
    function(error, response, body) {
      if (error) {
        console.log('Error sending messages: ', error)
      } else if (response.body.error) {
        console.log('Error: ', response.body.error)
      }
      console.log('Successful POST to Facebook API')
    })
  }

  think(text) {
    // Default response
    var stupidResponse = "Guess you're walking"
    var response = "Hi, I am " + this.name + "!"
    var time
    var day
    var origin
    var destination

    if (this.regex.RIDE.test(text)) {
      response = "Sure, I can help you find a carpool"
      day = text.match(this.regex.DAY) || '';

      if (day !== '') {
        response += ' ' + day;
      } else if (text.match(/yesterday/i)) {
        response = stupidResponse
      }

      response += "!"
    }

    return response
  }
}

module.exports = new Chevy();
