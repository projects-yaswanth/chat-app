const express = require('express');
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');
const msgController = require('./../controllers/msgController');
const router = express.Router();

router.route('/login').post(authController.login);
router.route('/signup').post(authController.signup);

router.use(authController.protect);
router.route('/logout').get(authController.logout);

router.route('/').get(userController.getUser).post(userController.createUser);
router.route('/friends').get(userController.getfriends);
router.route('/:id').get(userController.getUserById);
router.route('/addfriend/:id').post(userController.addfriend);
router.route('/');

module.exports = router;
