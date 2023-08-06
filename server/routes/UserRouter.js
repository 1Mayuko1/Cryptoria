const { Router } = require('express')
const router = new Router()
const userController = require('../controllers/UserController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.get('/', userController.getAll)
router.get('/auth', authMiddleware, userController.checkAuth)

module.exports = router