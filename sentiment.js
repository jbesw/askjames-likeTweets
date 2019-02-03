const AWS = require('aws-sdk')
AWS.config.update({ region: process.env.REGION || 'us-east-1' })
var comprehend = new AWS.Comprehend()

const getSentiment =  async function(Text) {

    console.log(`getSentiment: text=${Text}`)
    if (!Text) return null
  
    var params = {
      LanguageCode: "en",
      Text
    }
    return new Promise((resolve, reject) => {
			comprehend.detectSentiment(params, (err, data) => {
				if (err) return reject(err)
				else return resolve(data)
			})
    })
}

module.exports = { getSentiment }