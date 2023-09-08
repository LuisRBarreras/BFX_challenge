const EVENT_NAMES = {
  PROCESS_ORDER: 'PROCESS_ORDER'
}

const ORDER_TYPES = {
  SELL: 'SELL',
  BUY: 'BUY'
}

function getUniqueId () {
  return Date.now() + Math.floor(Math.random() * 9999999)
}

module.exports = {
  getUniqueId,
  EVENT_NAMES,
  ORDER_TYPES
}
