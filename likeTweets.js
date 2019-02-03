'use strict'

const Twitter = require('twitter')
const config = {     
  consumer_key: '<< INSERT YOUR CREDS >>',    // << LOOK!
  consumer_secret: '<< INSERT YOUR CREDS >>',     
  access_token_key:'<< INSERT YOUR CREDS >>',     
  access_token_secret:'<< INSERT YOUR CREDS >>' 
} 

const client = new Twitter(config);
const { getSentiment } = require('./sentiment.js')

const params = {
  q: '@<< INSERT YOUR HANDLE >>',   // << LOOK!
  lang: 'en',
  count: 10,
  result_type: 'recent'
}

// This should be equal to the frequncy of your polling - if you poll every 30
// mins, then the function should only care about tweets in the last 30 mins.
const maxTweetAgeInMins = 5

// Sentiment positivity is measured from 0 to 1 - setting this threshold is
// the level at which we will like the Tweet.
const positivityThreshold = 0.6

const likeTweets = async () => {

  const tweets = await client.get('search/tweets', params)
  console.log(`Found ${tweets.statuses.length} tweet(s)`)
  console.log(tweets)

  for(let i = 0; i < tweets.statuses.length; i++) {
    let tweet = tweets.statuses[i]
    let id = tweets.statuses[i].id_str 
    // Converts from milliseconds to mins
    const ageInMins = (Date.now() - new Date(tweet.created_at))/1000/60

    // If tweet was sent in the accepted time range...
    if (ageInMins <= maxTweetAgeInMins) {
      console.log(`Checking sentiment for ${id}: ${tweet.text}`)
      const sentiment = await getSentiment(tweet.text)
      console.log ('Sentiment is: ', sentiment)

      // If the positivity is above the threshold, like the tweet
      if (sentiment.SentimentScore.Positive >= positivityThreshold) {
        console.log('Liking Tweet... ', id)
        try {
          const response = await client.post('favorites/create', { id })
          console.log('Response: ', response)
        } catch (err) {
          console.err('Like failed: ', err)
        }
      }
    }
  }
}

module.exports = { likeTweets }
