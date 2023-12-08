const { Router } = require('express')
const router = new Router()
const userCryptocurrenciesController = require('../controllers/UserCryptocurrenciesController')

router.post('/', userCryptocurrenciesController.create)
router.get('/', userCryptocurrenciesController.getAll)
router.get('/:id', userCryptocurrenciesController.getAllById)
router.delete('/', userCryptocurrenciesController.delete);

module.exports = router
