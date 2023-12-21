const { Router } = require('express')
const router = new Router()
const forecastDataController = require('../controllers/ForecastDataController')

router.post('/', forecastDataController.create)
router.get('/', forecastDataController.getAll)
router.get('/:cryptoCode', forecastDataController.getOneById)
router.delete('/', forecastDataController.deleteAll)

module.exports = router
