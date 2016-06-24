'use strict'

var Promise = require('bluebird')
var graph = require('fbgraph')
var natural = require('natural')
var moment = require('moment')
var dictionary = require('../dictionary')
var Util = require('../../utils')

var fbGroupId = '372772186164295'
var userAccessToken = 'EAACEdEose0cBAIH0twvrrg5aCjNPKxVucSIBaZBlBzCqtrWU4jUOdlGSmSHGfXw88sOJSmkLiGtYgtqD5C8PBoSjij3RNxuPwcHscvDZBzUZAwGaErZAvtk5J7ZCUZA3dZCYCgwtPqZAK2n3VZC2lAL2ZANfEooWEOWQRVzzfTEG6VsQZDZD'

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
  graph.setAccessToken(userAccessToken)

  var graphGetAsync = Promise.promisify(graph.get)
  var since = moment().subtract(3, "days").unix()

  return graphGetAsync(fbGroupId + '/feed' + '?since=' + since)
  .then(function(res) {
    var data = res.data
    var matches = []
    var tokenizer = new natural.WordTokenizer()

    data.forEach(function(record, index, records) {
      var tokens = tokenizer.tokenize(record.message)
      if (isMatch(origin, destination, tokens) && !Util.stringMatch(tokens, 'looking')) {
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
  var driverDestination = Util.getDestination(tokens)

  if (origin === driverOrigin && destination === driverDestination) {
    return true
  }

  return false
}

module.exports = parse
