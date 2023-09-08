'use strict'

const { RPCClient } = require("../distributed-exchange/rpc-client")
const { OrderBook, Order } = require("../models/order-book")
const { getUniqueId, EVENT_NAMES, ORDER_TYPES } = require("../utils")



async function sellOrderDemo() {
  const clientId = getUniqueId()
  const orderBook = new OrderBook(clientId)
  
    const type= ORDER_TYPES.SELL
    const ticketSymbol = 'TSLA'
    const unit= 1
    const marketPrice= 1000
    const goalPrice = 999

  const sellOrder = new Order(clientId, type, ticketSymbol, unit, marketPrice, goalPrice)

  orderBook.addSell(sellOrder)
  

  const rpcClient = new RPCClient()
  const event = {
    name: EVENT_NAMES.PROCESS_ORDER,
    payload: {order: JSON.stringify(sellOrder)}
  }

  try {
    await rpcClient.sendEvent(event)
    
  } catch (error) {
    console.error(error)
    throw error
    
  }

}


sellOrderDemo()



