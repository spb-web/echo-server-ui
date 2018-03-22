const express = require('express')
const app = express()
var bodyParser = require('body-parser')
const port = 3000

// app.use(bodyParser.json())
// app.use(bodyParser.json())
// app.use(bodyParser.json({ type: 'application/*+json' }))
// //app.use(bodyParser.urlencoded())
// app.use(bodyParser.text({ type: 'text/html' }))
// app.use(bodyParser.raw({ type: '*/*' }))

exports.start = function () {
  return new Promise(function(resolve, reject) {
    app.listen(port, err => {
      if (err) {
        return reject(err)
      }

      console.log(`server is listening on ${port}`)
      resolve()
    })
  })
}

exports.onRequest = function(callback) {
  app.use('/', function(req, res, next) {
    let data = ''

    req.on('data', function( chunk ) {
      data += chunk;
    })

    req.on('end', function() {
      req.rawBody = data;

      next()
    })
  },
  (request, response) => {
      callback(request)

      response.send('')
  })
}
