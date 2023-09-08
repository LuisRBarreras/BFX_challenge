function getUniqueId () {
  return Date.now() + Math.floor(Math.random() * 9999999)
}

module.exports = {
  getUniqueId
}