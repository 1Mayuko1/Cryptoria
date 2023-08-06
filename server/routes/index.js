const Router = require('express')
const router = new Router

const CryptocurrencyRouter = require('./CryptocurrencyRouter')
const ExchangeRatesRouter = require('./ExchangeRatesRouter')
const UserCryptocurrenciesRouter = require('./UserCryptocurrenciesRouter')
const UserRouter = require('./UserRouter')

router.use('/user', UserRouter)
router.use('/userCryptocurrencies', UserCryptocurrenciesRouter)
router.use('/cryptocurrency', CryptocurrencyRouter)
router.use('/exchangeRates', ExchangeRatesRouter)

module.exports = router