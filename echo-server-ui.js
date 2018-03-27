const serverIn = require('./serverIn')
const serverOut = require('./serverOut')

async function start() {
  serverIn.onRequest({
    requestCallback: serverOut.sendRequestData,
    responseCallback: serverOut.sendResponseData
  })

  await Promise.all([serverIn.start(), serverOut.start()])
}

start()
