const path = require('path')
const { Sell } = require('../sniper')
const { ToWei } = require('../utils/decode')
const Types = require('../utils/types')
const { Instance } = require('./contract')


const config = store.get('config')
const tokens = []

const checkProfits = async (tokenAddress) => {

  var response = {
      msg: 'Calculando...',
      profit: 0,
      profitPercent: 0
  }

  return response
}

const getTokenByAddress = (address) => {
    return tokens.find(token => {
        return token.address.toLowerCase() === address.toLowerCase()
    })
}

module.exports = {
    checkProfits
}
