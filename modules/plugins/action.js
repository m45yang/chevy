'use strict'

var Promise = require('bluebird')
var graph = require('fbgraph')
var natural = require('natural')
var dictionary = require('../dictionary')
var Util = require('../../utils')

var fbGroupId = '372772186164295'
var userAccessToken = 'EAACEdEose0cBAKKv41m7CLvh0n4UraZAnkzGJahTeNd8vUgcc4qZArZBpYl1NrZCO0P1a53ENk5kHZCSh6s0dfiqdXrFvY3pZCnGtzxcC6l0wvV6feYwZCXtZBmMZAVhWO0j3jlk5N72rU1jpVUe7MsZCV8bI3yZBfc6GPeQS2PoFM3IQZDZD'

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
    .then(function(links) {
      if (links.length > 0) {
        links.forEach(function(link, index, links) {
          context.replies.push(link)
        })
      }
      else {
        context.replies.push('No rides found')
      }

      return Promise.resolve(context)
    })
  }
  else if (actions.indexOf('requestOrigin') > -1) {
    context.replies.push('Please enter an origin')
  }
  else if (actions.indexOf('requestDestination') > -1) {
    context.replies.push('Please enter a destination')
  }
  else if (actions.indexOf('greet') > -1) {
    var greetings = ['Hi!', 'Hello! I am Chevy!', 'Hey there!', 'Hey!', 'Chevy reporting for duty!']
    context.replies.push(Util.randomElement(greetings))
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
  console.log('search', origin, 'to', destination)
  graph.setAccessToken(userAccessToken)

  var graphGetAsync = Promise.promisify(graph.get)

  return graphGetAsync(fbGroupId + '/feed')
  .then(function(res) {
    var data = res.data
    var matches = []
    var tokenizer = new natural.WordTokenizer()

    data.forEach(function(record, index, records) {
      var tokens = tokenizer.tokenize(record.message)
      if (isMatch(origin, destination, tokens)) {
        matches.push(graphGetAsync(record.id))
      }
    })

    return Promise.all(matches)
  })
  .then(function(res) {
    var links = []

    res.forEach(function(element, index, elements) {
      links.push(element.actions[0].link)
    })

    return Promise.resolve(links)
  })
}

var isMatch = function(origin, destination, tokens) {
  var driverOrigin = Util.getOrigin(tokens)
  var driverDestination = Util.getDestination(tokens)

  if (origin === driverOrigin && destination === driverDestination) {
    return true
  }

  return false
}

module.exports = parse
