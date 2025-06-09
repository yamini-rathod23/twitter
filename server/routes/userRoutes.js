const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateUser } = require('../validators/userValidator');

router.post('/users', validateUser, userController.createUser);
router.get('/users', userController.getAllUsers);
router.post('/login', userController.loginUser);

module.exports = router;
