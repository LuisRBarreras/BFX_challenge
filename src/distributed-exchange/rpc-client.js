'use strict'

const { PeerRPCClient } = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')

class RPCClient {
  constructor () {
    this.link = new Link({
      grape: 'http://127.0.0.1:30001'
    })

    this.link.start()

    this.peer = new PeerRPCClient(this.link, {})
    this.peer.init()
  }

  promisifyPeerRequest (peer, name, payload, config) {
    return new Promise((resolve, reject) => {
      peer.request(name, payload, config, (err, data) => {
        if (err) {
          console.error(err)
          return reject(err)
        }

        return resolve(data)
      })
    })
  }

  async sendEvent (event) {
    const { name, payload, config = { timeout: 1000 } } = event

    try {
      const promise = this.promisifyPeerRequest(this.peer, name, payload, config)
      const result = await promise

      return result
    } catch (error) {
      console.error(`Error on Client sendEvent: ${JSON.stringify(event)}`)
      throw error
    }

 
  }
}

module.exports = { RPCClient }
