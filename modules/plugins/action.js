'use strict'

var Promise    = require('bluebird')
var graph      = require('fbgraph').setVersion('2.7')
var natural    = require('natural')
var _          = require('lodash')
var dictionary = require('../dictionary')
var Util       = require('../utils')
var config     = require('../../config')

var fbGroupId = config.fbGroupId
var userAccessToken = 'EAAV2U0FJIDIBAKqdsQunNPA5g8zJEjdSPZCgIhEHg1HYBmyZBZBtgGTUNgkgAjjWMiAZCyKkKnSqvWzJso5q5y4rRmkTL8XT4lZBbuWJkJ035ApbjNSvJCW628ZCULKe9ocD91QgVtZCLqVGhlfINZCZAiTG5ZB7HuTX0ZD'
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
      // Compile the replies into messageData objects
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
      // Response for no rides found
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
  var query = fbGroupId + '/feed?limit=' + searchLimit
              + '&fields=from,message,actions';

  return graphGetAsync(query)
  .then(function(res) {
    var responses = res.data
    var matches = []
    var tokenizer = new natural.WordTokenizer()

    var filteredResponses = _.filter(responses, function(response) {
      var tokens = tokenizer.tokenize(response.message)
      // If the origin and destination match and it's not a 'looking' post,
      // add it to the existing matches
      if (isMatch(origin, destination, tokens) && !Util.stringMatch(tokens, 'looking')) {
        return true   
      }
      else {
        return false
      }
    })

    var replies = [[]]
    var elementGroup = 0

    // Build the elements to be added to a generic template
    // message
    filteredResponses.forEach(function(response, index) {
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
