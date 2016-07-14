'use strict'

var request      = require('request-promise')
var natural      = require('natural')
var Promise      = require('bluebird')
var conversation = require('./plugins/conversation')
var search       = require('./plugins/search')
var action       = require('./plugins/action')

class Chevy {
  constructor() {
    this.name = "Chevy"
    this.accessToken = "EAAV2U0FJIDIBAFJ4RZANJuW9ILWY1z6cLZAR7NIue64LRxyNMYiVowrKm6xC4ZBzk6d3E2gH9Ca1ezf0ZCNUpMHaPFUfUv6d7uw0SmIQA56jSszf0fAIyZAVX5DqZBBRZAZBk9mKuwvhqVgz5Obs5gq7HzvkzcyVr0T6lSGsQSqSGwZDZD"
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
    .catch(function(error) {
      return Promise.reject(error)
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
