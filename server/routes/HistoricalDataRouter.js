const { Router } = require('express')
const router = new Router()
const historicalDataController = require('../controllers/HistoricalDataController')

router.post('/', historicalDataController.create)
router.get('/', historicalDataController.getAll)
router.get('/:code', historicalDataController.getOneById)
router.delete('/', historicalDataController.deleteAll)

module.exports = router
