'use strict'

var Promise = require('bluebird')
var graph = require('fbgraph')
var natural = require('natural')
var dictionary = require('../dictionary')
var Util = require('../../utils')

var fbGroupId = '372772186164295'
var userAccessToken = 'EAACEdEose0cBADFPUooKZCcL1ItYt3o6Y7UU5hZBGgPySpfgBtrFjPcWCo1lGZA4GeDuwIVMY2MDASWnyUi7Ea3r107R2dA2ZBgJtohW2BiIrC6QZCwEd5YrXZCZAfj6C7OUuMETD3ZAEvGpIIZCkmyZB0ZCyJvfijZCPG4fZCJ7NnDhfxAZDZD'
var searchLimit = 50

/**
 * Gets the actions required from the context object
 * and performs them
 * @param  {[object]} context
 * @return {[object]} context
 */
var parse = function(context) {
  var actions = context.actions

  if (actions.indexOf('search') > -1) {
    return rideSearch(context.origin, context.destination)
    .then(function(elements) {
      if (elements[0].length > 0) {
        elements.forEach(function(element) {
          var messageData = {
            attachment: {
              type: 'template',
              'payload': {
                template_type: 'generic',
                elements: element
              }
            }
          }

          context.replies.push(messageData)
        })

      }
      else {
        context.replies.push({ text: 'No rides found'})
      }

      return Promise.resolve(context)
    })
  }
  else if (actions.indexOf('requestOrigin') > -1) {
    context.replies.push({ text: 'Please enter an origin' })
  }
  else if (actions.indexOf('requestDestination') > -1) {
    context.replies.push({ text: 'Please enter a destination' })
  }
  else if (actions.indexOf('greet') > -1) {
    var greetings = ['Hi!', 'Hello! I am Chevy!', 'Hey there!', 'Hey!', 'Chevy reporting for duty!']
    context.replies.push({ text: Util.randomElement(greetings) })
  }

  return Promise.resolve(context)
}

/**
 * Searches facebook carpool group for drivers leaving
 * from origin to destination on date
 * @param  {[string]} origin
 * @param  {[string]} destination
 * @param  {[Date]}   date
 * @return {[object]} payload
 */
var rideSearch = function(origin, destination, date) {
  graph.setAccessToken(userAccessToken)
  var graphGetAsync = Promise.promisify(graph.get)

  // variables to pass along promise chain
  var matchedResponses

  return graphGetAsync(fbGroupId + '/feed?limit=' + searchLimit)
  .then(function(res) {
    var data = res.data
    var matches = []
    var tokenizer = new natural.WordTokenizer()

    data.forEach(function(record, index, records) {
      var tokens = tokenizer.tokenize(record.message)
      // If the origin and destination match and it's not a 'looking' post,
      // add it to the existing matches
      if (isMatch(origin, destination, tokens) && !Util.stringMatch(tokens, 'looking')) {
        matches.push(graphGetAsync(record.id))
      }
    })

    return Promise.all(matches)
  })
  .then(function(responses) {
    matchedResponses = responses
    var replies = [[]]
    var elementGroup = 0

    // Build the elements to be added to a generic template
    // message
    matchedResponses.forEach(function(response, index) {
      // Increase element group every 10 elements
      if (index % 10 === 9) {
        elementGroup += 1
        replies[elementGroup] = []
      }

      var reply = {
        title: response.from.name,
        subtitle: response.message,
        buttons: [
          {
            type: 'web_url',
            url: response.actions[0].link,
            title: 'Original Post'
          }
        ]
      }

      replies[elementGroup].push(reply)
    })

    return Promise.resolve(replies)
  })
}

/**
 * Parses an array of tokens to determine if there is an
 * origin-destination pair match
 * @param  {[string]}  origin
 * @param  {[string]}  destination
 * @param  {[array]}  tokens
 * @return {Boolean}
 */
var isMatch = function(origin, destination, tokens) {
  var driverOrigin = Util.getOrigin(tokens)
  var driverDestination = Util.getDestination(tokens, driverOrigin)

  if (origin === driverOrigin && destination === driverDestination) {
    return true
  }

  return false
}

module.exports = parse
