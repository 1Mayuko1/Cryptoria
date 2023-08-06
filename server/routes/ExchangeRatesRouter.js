const { Router } = require('express')
const router = new Router()
const exchangeRatesController = require('../controllers/ExchangeRatesController')

router.post('/', exchangeRatesController.create)
router.get('/', exchangeRatesController.get)

module.exports = router