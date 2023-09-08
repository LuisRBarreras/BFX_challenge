const { getUniqueId, ORDER_TYPES } = require('../utils')

class OrderBook {
  constructor (clientId) {
    this.clientId = clientId
    this.buyOrders = []
    this.sellOrders = []
    this.history = []
  }

  _addHistory (order) {
    this.history = order
  }

  addBuy (order) {
    this.buyOrders.push(order)
    this._addHistory(order)
  }

  addSell (order) {
    this.sellOrders.push(order)
    this._addHistory(order)
  }

  _processSellOrder (externalSellOrder) {
    const foundBuyOrder = this.buyOrders.find(buyOrder => {
      const { tickerSymbol, maxPrice } = buyOrder

      return (tickerSymbol === externalSellOrder.tickerSymbol &&
        maxPrice >= externalSellOrder.minPrice)
    })

    if (foundBuyOrder) {
      const transaction = new Transaction(foundBuyOrder, externalSellOrder, externalSellOrder.minPrice)
      this.history.push(transaction)

      // Delete order from buys
      this.buyOrders = this.buyOrders.filter(order => {
        return (order.orderId !== foundBuyOrder.orderId)
      })

      return transaction
    }

    return null
  }

  _processBuyOrder (externalBuyOrder) {
    const foundSellOrder = this.sellOrders.find(buyOrder => {
      const { tickerSymbol, maxPrice: minPrice } = buyOrder
      return (tickerSymbol === externalBuyOrder.tickerSymbol &&
        externalBuyOrder.maxPrice >= minPrice)
    })

    if (foundSellOrder) {
      const transaction = new Transaction(foundSellOrder, externalBuyOrder, externalBuyOrder.maxPrice)
      this.history.push(transaction)


      // Delete order from sell
      this.sellOrders = this.sellOrders.filter(order => {
        return (order.orderId !== foundSellOrder.orderId)
      })

      return transaction
    }

    return null
  }

  processOrder (externalOrder) {
    console.log('externalOrder', externalOrder.type)

    if (externalOrder.type === ORDER_TYPES.SELL) {
      console.log('Processing sell order')
      this._processSellOrder(externalOrder)
    } else if (externalOrder.type === ORDER_TYPES.BUY) {
      console.log('Processing buy order')
      this._processBuyOrder(externalOrder)

    }
  }

}

class Transaction {
  /**
   * @param {Order} myOrder
   * @param {Order} externalOrder
   */
  constructor (myOrder, externalOrder, settlementPrice) {
    // TODO check logic transaction id
    this.transactionId = getUniqueId()
    this.transactionDate = Date.now()
    this.externalClientId = externalOrder.clientId
    this.settlementPrice = settlementPrice
    this.originalOrder = myOrder
    this.externalOrder = externalOrder
  }
}

class Order {
  constructor (clientId, type, tickerSymbol, units, marketPrice, goalPrice, status = 'New') {
    this.orderId = getUniqueId()
    this.clientId = clientId
    this.type = type
    this.tickerSymbol = tickerSymbol
    this.units = units
    this.marketPrice = marketPrice
    this.goalPrice = goalPrice
    this.status = status
    this.minPrice = null
    this.marketPrice = null

    if (type === ORDER_TYPES.SELL) {
      this.minPrice = goalPrice
    } else if (type === ORDER_TYPES.BUY) {
      this.maxPrice = goalPrice
    }
  }
}

module.exports = {
  OrderBook,
  Order,
  Transaction
}
