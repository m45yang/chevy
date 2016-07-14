'use strict'

var request      = require('request-promise')
var natural      = require('natural')
var Promise      = require('bluebird')
var conversation = require('./plugins/conversation')
var search       = require('./plugins/search')
var action       = require('./plugins/action')
var config       = require('../config')

class Chevy {
  constructor() {
    this.name = "Chevy"
    this.accessToken = config.pageAccessToken
    this.tokenizer = new natural.WordTokenizer()
  }

  /**
   * Replies the sender with all the reply strings in order
   * @param  {id}    sender  [id of Facebook user to reply]
   * @param  {array} text    [array containing all the needed replies]
   */
  reply(sender, replies) {
    var self = this

    // Fail safe
    if (replies.length === 0) {
      return self.sendMessage(sender, {
        text: 'Sorry, I didn\'t understand what you said!'
      })
    }

    return replies.reduce(function(sequence, reply) {
      return sequence.then(function(result) {
        return self.sendMessage(sender, reply)
      })
    }, Promise.resolve())
  }

  /**
   * Sends a message to sender
   * @param  {[integer]} sender      [sender id]
   * @param  {[string]} messageData  [object containing message]
   * @return {[Promise]}
   */
  sendMessage(sender, messageData) {
    var self = this

    return request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: { access_token : self.accessToken },
      method: 'POST',
      json: {
          recipient: { id : sender },
          message: messageData,
      }
    })
  }

  /**
   * Runs all the plugins that power Chevy's decision making process
   * in a promise chain
   * @param  {[object]} context [conversation context]
   * @return {[null]}
   */
  think(context) {
    // tokenize the query
    context.queryTokens = this.tokenizer.tokenize(context.query)

    return conversation(context)
    .then(function(context) {
      return search(context)
    })
    .then(function(context) {
      return action(context)
    })
  }
}

module.exports = new Chevy()
