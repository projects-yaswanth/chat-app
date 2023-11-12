const express = require('express');
const viewsController = require('./../controllers/viewsController');
const authController = require('./../controllers/authController');
const msgController = require('./../controllers/msgController');
const router = express.Router();

router.route('/login').get(viewsController.getLogin);
router.route('/signup').get(viewsController.getSignup);

router.use(authController.isLoggedIn);

router.route('/').get(viewsController.getOverview);
router.route('/logout').get(viewsController.logout);
router
  .route('/chats/:name')
  .get(msgController.getMsgs)
  .post(msgController.saveMsg);
router.route('/addfriend').get(viewsController.addfriend);
module.exports = router;
