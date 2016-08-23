'use strict'

/**
 * Initialize bunyan loggers
 */

var bunyan = require('bunyan')
var bunyanMiddleware = require('express-bunyan-logger')

var initLogger = function(app) {

  var logger = bunyan.createLogger({
    name: 'chevy',
    stream: process.stdout
  })

  // Expose logger
  app.log = logger

  // Per request logger
  app.use(bunyanMiddleware({
    name: 'chevy',
    streams: [{
      level: 'info',
      stream: process.stdout
    }]
  }))

}

module.exports = initLogger
