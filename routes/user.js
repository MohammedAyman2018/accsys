var express = require('express')
var router = express.Router()

const { upload } = require('../middlewares/upload')

const controller = require('../controllers/users_ctrl')

/** Get All Users */
router.get('/all', async (req, res) => controller.get_all_users(req, res))

/** Get one user */
router.get('/one', async (req, res) => controller.get_one_user(req, res))

/** Add user */
router.post('/', upload.single('image'), (req, res) => controller.add_user(req, res))

/** Login */
router.post('/login', upload.none(), (req, res) => controller.login(req, res))

/** Update user */
router.patch('/:id', upload.single('image'), async (req, res) => controller.edit_user(req, res))

/** Delete user */
router.delete('/:id', async (req, res) => controller.delete_one(req, res))

/** Delete all */
router.delete('/delete/all', async (req, res) => controller.delete_all(req, res))

module.exports = router
