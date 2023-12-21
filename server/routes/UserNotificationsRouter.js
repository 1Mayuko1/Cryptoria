const { Router } = require('express')
const router = new Router()
const UserNotificationsController = require('../controllers/UserNotificationsController')

router.post('/', UserNotificationsController.create)
router.get('/', UserNotificationsController.getAll)
router.get('/:id', UserNotificationsController.getAllById)
router.delete('/', UserNotificationsController.delete);
router.delete('/deleteAll', UserNotificationsController.deleteAll);

module.exports = router
