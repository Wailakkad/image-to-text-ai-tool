const express = require('express');
const router = express.Router();
const {logout , Register , Login} = require('../../controller/authController/auth');

router.post('/login', Login);
router.post('/register', Register);
router.get('/logout', logout);


module.exports = router;