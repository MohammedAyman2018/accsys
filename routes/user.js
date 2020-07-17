var express = require('express')
var router = express.Router()

const { upload } = require('../middlewares/upload')

const controller = require('../controllers/users_ctrl')
const auth = require('../middlewares/auth')

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
router.delete('/:id', auth, async (req, res) => controller.deleteOne(req, res))

/** Delete all */
router.delete('/delete/all', auth, async (req, res) => controller.deleteAll(req, res))

module.exports = router
