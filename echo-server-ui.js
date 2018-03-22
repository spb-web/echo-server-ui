const serverIn = require('./serverIn')
const serverOut = require('./serverOut')

async function start() {
  serverIn.onRequest(serverOut.sendData)

  await Promise.all([serverIn.start(), serverOut.start()])
}

start()
