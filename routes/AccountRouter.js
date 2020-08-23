// imports
const express = require('express');
const accountController = require('../controllers/AccountController');

// configs
const app = express();
const router = express.Router();

// test route
router.get('/test', accountController.test);

// reset route
router.post('/reset', accountController.reset);

// account process
router.post('/event', accountController.processAccountEvent);

// account balance
router.get('/balance', accountController.getBalance);

module.exports = router;
