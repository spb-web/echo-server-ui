const PROXY = require('./constants/PROXY')
const express = require('express')
const app = express()
var bodyParser = require('body-parser')
const http = require('http')

const port = 3000

/**
 * Тут храним обработчики
 */
const requestHandlers = []
/**
 * Id запроса
 */
let requestCount = 0



function onRequest(req, res) {
  let data = ''

  req.reqId = requestCount++
  req.type = 'request'

  req.on('data', chunk => data += chunk)
  req.on('end', () => {
    req.rawBody = data
    requestHandlers.forEach(requestHandler => requestHandler.requestCallback(req))
  })



  console.log('serve: ' + req.url)

  var options = {
    hostname: PROXY.PROXY_TO.HOST,
    port: 80,
    path: req.url,
    method: 'GET'
  };

  var proxy = http.request(options, function (proxyRes) {
    proxyRes.pipe(res, { end: true })
    proxyRes.reqId = req.reqId
    proxyRes.type = 'response'

    requestHandlers.forEach(responseHandler => responseHandler.responseCallback(proxyRes))
  })

  req.pipe(proxy, { end: true })
}

/**
 * Запуск сервера
 */
exports.start = function () {
  return new Promise(function(resolve, reject) {
    http.createServer(onRequest).listen(port, err => {
      if (err) {
        return reject(err)
      }

      console.log(`server is listening on ${port}`)
      resolve()
    })
  })
}

exports.onRequest = function(callback) {
  requestHandlers.push(callback)
}
