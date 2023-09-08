const { PeerRPCServer } = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')
const { EVENT_NAMES, ORDER_TYPES } = require('../utils')
const { Order } = require('../models/order-book')

// class RPCServer() {
//   constructor() {

//   }

// }

// TODO MOVE logic
const clientId = 2
const type = ORDER_TYPES.BUY
const tickerSymbol = 'TSLA'
const unit = 1
const marketPrice = 1000
const maxPrice = 999

const demoBuyOrder = new Order(clientId, type, tickerSymbol, unit, marketPrice, maxPrice)
const listOrders = [demoBuyOrder]


function findOrderMatch (orderReceived) {
  if (orderReceived.type === ORDER_TYPES.SELL) {
    const orderMatch = listOrders.find(order => {
      return (order.type === ORDER_TYPES.BUY &&
          order.tickerSymbol === orderReceived.tickerSymbol &&
          order.maxPrice >= orderReceived.minPrice
      )
    })

    if (orderMatch) {
      console.log('Order match', JSON.stringify({ orderMatch }))
      return orderMatch
    }
  } else {
    return null
    // TODO Add logic to handler orderReceived as type BUY
  }
}

const handlerEvent = (rid, key, payload, handler) => {
  console.log({ rid, key })

  console.log(payload, handler)
  const orderReceived = JSON.parse(payload.order)

  const orderFound = findOrderMatch(orderReceived)
  if(orderFound) {
    console.log({foundOrder: orderFound})
    handler.reply(null, { orderFound : JSON.stringify(orderFound) })
  }

}

function server () {
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

  console.log('Running PeerRPCService', 'http://127.0.0.1:30001')
  console.log(`Services listening on port ${port}`)
  service.listen(port)

  setInterval(function () {
    link.announce(EVENT_NAMES.PROCESS_ORDER, service.port, {})
  }, 1000)

  service.on('request', handlerEvent)
}

server()
