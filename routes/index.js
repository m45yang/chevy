/**
 * Route definitions for Chevy
 */

var webhook = require('../modules/controllers/webhook');
var auth = require('../modules/controllers/auth');

module.exports = function(app) {
  // Index route
  app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
  })

  app.post('/webhook/', webhook.index)
  app.get('/webhook/', webhook.verify)

  // Endpoint to get a user's Facebook access token
  app.get('/auth/facebook', auth.facebook)
}
