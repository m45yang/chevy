'use strict'

var request = require('request')
var conversation = require('./conversation')

class Chevy {
  constructor() {
    this.name = "Chevy"
    this.accessToken = "EAAV2U0FJIDIBAFJ4RZANJuW9ILWY1z6cLZAR7NIue64LRxyNMYiVowrKm6xC4ZBzk6d3E2gH9Ca1ezf0ZCNUpMHaPFUfUv6d7uw0SmIQA56jSszf0fAIyZAVX5DqZBBRZAZBk9mKuwvhqVgz5Obs5gq7HzvkzcyVr0T6lSGsQSqSGwZDZD"
  }

  /**
   * Replies the sender, each response has a delay of 300ms
   * @param  {id}    sender  [id of Facebook user to reply]
   * @param  {array} text    [array containing all the needed replies]
   */
  reply(sender, replies) {
    if (replies.length === 0) {
      return
    }

    var reply = replies.shift()
    var messageData = {
      text: reply
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

    setTimeout(this.reply(sender, replies), 300)
  }

  think(context) {
    context = conversation.parse(context)
    if (context.replies.length === 0) {
      context.replies.push('Sorry, I am still learning and I am not quite sure what you meant!')
    }
  }
}

module.exports = new Chevy();
