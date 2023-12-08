const { Router } = require('express')
const router = new Router()
const cryptocurrencyController = require('../controllers/CryptocurrencyController')

router.post('/', cryptocurrencyController.create)
router.post('/create-multiple', cryptocurrencyController.createMultiple);
router.get('/', cryptocurrencyController.getAll)
router.get('/:id', cryptocurrencyController.getOneById)
router.delete('/', cryptocurrencyController.deleteAll)

module.exports = router
