/**
 * Authentication methods controller
 */

var graph = require('fbgraph')
var config = require('../config.json')
var accessToken = require('../models/accessToken')

module.exports = {

  /**
   * Flow for a user to provide an access token
   * @param  {[object]} req [description]
   * @param  {[object]} res [description]
   */
  facebook: function(req, res) {
    var sender = req.query.sender

    // Redirect to the Oauth dialog if code
    // is not provided
    if (!req.query.code) {
      var authUrl = graph.getOauthUrl({
        "client_id": config.clientId,
        "redirect_uri": config.authUrl[process.env.NODE_ENV] + '?sender=' + sender
      })

      if (!req.query.error) {
        res.redirect(authUrl)
      } else {
        res.status(500).json({ message: 'Access denied.' });
      }
      return
    }

    // Use provided code to get access token
    graph.authorize({
      "client_id": config.clientId,
      "redirect_uri": config.authUrl + '?sender=' + sender,
      "client_secret": config.clientSecretKey,
      "code": req.query.code
    }, function (err, response) {
      if (err) {
        return res.status(400).json({ message: err })
      }

      var query = {
        userId: sender
      }

      var token = { 
        userId: sender,
        accessToken: response.access_token
      }

      accessToken.findOneAndUpdate(query, token, { upsert: true }, function(err, record) {
        if (err) {
          res.status(500).json({ message: err })
        }
        else {
          res.redirect('/')
        }
      })
    })
  }

}
