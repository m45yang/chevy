'use strict'

var request = require('request-promise')
var natural = require('natural')
var Promise = require('bluebird')
var conversation = require('./plugins/conversation')
var search = require('./plugins/search')
var action = require('./plugins/action')

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
    if (replies.length === 0) {
      return
    }

    var self = this
    var messageData = null
    replies.reduce(function(sequence, reply) {
      messageData = {
        text: reply
      }

      return sequence.then(self.sendMessage(sender, messageData))
      .catch(function(error) {
        if (error) {
          console.log('Error sending messages: ', error)
          return Promise.reject(error)
        }
      });
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
    context.queryTokens = this.tokenizer.tokenize(context.query)
    conversation(context)
    search(context)
    action(context)
  }
}

module.exports = new Chevy()
