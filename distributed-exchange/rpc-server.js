const { PeerRPCServer } = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')
const { EVENT_NAMES } = require('../utils')

const link = new Link({
      grape: 'http://127.0.0.1:30001'
    })
    link.start()
    
    const peer = new PeerRPCServer(link, {
      timeout: 300000
    })
    peer.init()
    
    const port = 1024 + Math.floor(Math.random() * 1000)
    const service = peer.transport('server')
    
    console.log('Running PeerRPCServce', 'http://127.0.0.1:30001')
    console.log(`Services listening on port ${port}`)
    service.listen(port)
    
setInterval(function () {
  link.announce(EVENT_NAMES.PROCESS_ORDER, service.port, {})
}, 1000)
    
  const listOrders = []

service.on('request', (rid, key, payload, handler) => {
  console.log({ rid, key })

  console.log(payload, handler) //  { msg: 'hello' }
  handler.reply(null, { msg: 'world' })
})
