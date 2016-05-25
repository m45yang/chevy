'use strict'

import request from 'request'

export default class Chevy {
  constructor() {
    this.name = "Chevy"
    this.accessToken = "CAARZAXuMIOewBAJo3VjIFfUOpuck1IW5AEymxMzrMkXNjMRsIlVR4wBhqibvh1M1xvOhxFcrR6C35yShzxzhyRRqrAo4hLzsrdXDuneRKeSRLPggL8BDMk0QIRO9OAIHtz1qOVrSRVxX4ji6j1e4SZC7CE2qE3YiwVjWNNb13sJFOLpsLk4WYzZCyrGLGgZD"
  }

  sendMessage(sender, text) {
    messageData = {
        text:text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token : this.accessToken },
        method: 'POST',
        json: {
            recipient: { id : sender },
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
        console.log('Successful POST to Facebook API')
    })
}
}
