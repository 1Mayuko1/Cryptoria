const Router = require('express')
const router = new Router

const CryptocurrencyRouter = require('./CryptocurrencyRouter')
const ExchangeRatesRouter = require('./ExchangeRatesRouter')
const UserCryptocurrenciesRouter = require('./UserCryptocurrenciesRouter')
const UserRouter = require('./UserRouter')
const UserNotificationsRouter = require('./UserNotificationsRouter')
const ForecastDataRouter = require('./ForecastDataRouter')
const HistoricalDataRouter = require('./HistoricalDataRouter')

router.use('/user', UserRouter)
router.use('/userCryptocurrencies', UserCryptocurrenciesRouter)
router.use('/userNotifications', UserNotificationsRouter)
router.use('/cryptocurrency', CryptocurrencyRouter)
router.use('/exchangeRates', ExchangeRatesRouter)
router.use('/forecastData', ForecastDataRouter)
router.use('/historicalData', HistoricalDataRouter)

module.exports = router
