'use strict'

const { RPCClient } = require('../distributed-exchange/rpc-client')
const { OrderBook, Order } = require('../models/order-book')
const { getUniqueId, EVENT_NAMES, ORDER_TYPES } = require('../utils')

async function sellOrderDemo () {
  const clientId = getUniqueId()
  const orderBook = new OrderBook(clientId)

  const type = ORDER_TYPES.SELL
  const tickerSymbol = 'TSLA'
  const unit = 1
  const marketPrice = 1000
  const goalPrice = 999

  const sellOrder = new Order(clientId, type, tickerSymbol, unit, marketPrice, goalPrice)

  orderBook.addSell(sellOrder)

  const rpcClient = new RPCClient()
  const event = {
    name: EVENT_NAMES.PROCESS_ORDER,
    payload: { order: JSON.stringify(sellOrder) }
  }

  try {
    const result = await rpcClient.sendEvent(event)
    if(result.orderFound) {
      const {clientId, type, tickerSymbol, units, marketPrice, goalPrice} = JSON.parse(result.orderFound)
      const orderFound =  new Order(clientId, type, tickerSymbol, units, marketPrice, goalPrice)
      orderBook.processOrder(orderFound)
    }

  } catch (error) {
    console.error(error)
    throw error
  }
}

sellOrderDemo()
