const { RPCServer } = require('../src/distributed-exchange/rpc-server')

function rpcProcessServer () {
  const server = new RPCServer()

  server.service.on('request', async (rid, key, payload, handler) => {
    console.log({ rid, key })

    console.log(payload, handler) //  { msg: 'hello' }
    const { order } = payload
    listOrders.push(order)

    handler.reply(null, { msg: 'world' })
  })
}

rpcProcessServer()
