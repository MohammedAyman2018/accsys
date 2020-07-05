var express = require('express')
var router = express.Router()

const { upload } = require('../middlewares/upload')

const controller = require('../controllers/users_ctrl')

/** Get All Users */
router.get('/all', async (req, res) => controller.getAllUsers(req, res))

/** Get one user */
router.get('/:id', async (req, res) => controller.getOneUser(req, res))

/** Add user */
router.post('/', upload.single('image'), (req, res) => controller.addUser(req, res))

/** Login */
router.post('/login', upload.none(), (req, res) => controller.login(req, res))

/** Update user */
router.patch('/:id', upload.single('image'), async (req, res) => controller.editUser(req, res))

/** Delete user */
router.delete('/:id', async (req, res) => controller.deleteOne(req, res))

/** Delete all */
router.delete('/delete/all', async (req, res) => controller.deleteAll(req, res))

module.exports = router
