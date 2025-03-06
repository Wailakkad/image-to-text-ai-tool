const express = require('express');
const { generateImage } = require("../controller/textToImageController")

const router = express.Router();

router.post('/generate-image', generateImage);

module.exports = router;