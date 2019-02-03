'use strict'

const { likeTweets } = require('./likeTweets')

module.exports.likeTweets = async (event, context) => {

  await likeTweets()

  return {
    statusCode: 200,
    body: 'OK'
  }
}
