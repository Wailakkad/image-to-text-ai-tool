const express = require("express");
const Router = express.Router();
const HashtagsController = require("../controller/Hashtags");


Router.post("/get-hashtags", HashtagsController);

module.exports = Router;