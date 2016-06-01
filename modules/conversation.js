'use strict'

var natural = require('natural')
var dictionary = require('./dictionary')
var ArrayUtils = require('../array-utils')

/**
 * Conversation class
 * Reading conversation strings and adding replies
 */

class Conversation {
  constructor() {
    this.tokenizer = new natural.WordTokenizer()
  }

  parse(context) {
    var query = context.query
    var tokens = this.tokenizer.tokenize(query)

    console.log('tokens: ', tokens)
    console.log('greetings: ', dictionary.greetings)

    for(var i=0; i<tokens.length; i++) {
      if (dictionary.greetings.indexOf(tokens[i]) > -1) {
        context.replies.push(ArrayUtils.random_element(['Hi!', 'Hello! I am Chevy!', 'Hey there!', 'Hey!', 'Chevy reporting for duty!']));
        context.replies.push('Prompt for carpool goes here');
        break;
      }
    }

    return context
  }
}

module.exports = new Conversation()
