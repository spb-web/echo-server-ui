const PROXY = require('./constants/PROXY')
const express = require('express')
const app = express()
const port = 3001

app.use(express.static('public'))
var expressWs = require('express-ws')(app)

const wsStore = new Map()

app.ws('/data', function(ws, req) {
  ws.id = wsStore.size + 1
  wsStore.set(ws.id, ws)


  ws.on('message', function(msg) {
    if (msg === 'start') {
      ws.send(JSON.stringify({
        initData: {
          PROXY
        }
      }))
    }
    console.log(msg)
  })
  ws.on('close', function() {
    wsStore.delete(ws.id)
  })

});

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

exports.sendRequestData = function(request) {
  const sendData = JSON.stringify({
    id: request.reqId,
    status: PROXY.REQUEST.STATUS.PANDING,
    headers: request.headers,
    query: request.query,
    params: request.params,
    body: request.rawBody,
    originalUrl: request.originalUrl,
    method: request.method,
    datetime: Date.now(),
    type: 'request'
  })

  //console.log(request)

  wsStore.forEach(ws => ws.send(sendData))
}


exports.sendResponseData = function(response) {
  const sendData = JSON.stringify({
    id: response.reqId,
    headers: response.headers,
    query: response.query,
    params: response.params,
    body: response.rawBody,
    originalUrl: response.originalUrl,
    method: response.method,
    datetime: Date.now(),
    type: 'response'
  })

  //console.log(request)

  wsStore.forEach(ws => ws.send(sendData))
}
