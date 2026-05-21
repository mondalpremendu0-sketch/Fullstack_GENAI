const express = require('express');
const isLogedIn = require('../middleware/auth.middleware.js')
const interviewController = require('../controllers/interView.controller.js')
const upload = require('../middleware/file.middleware.js')


const interViewrouter = express.Router();

interViewrouter.post("/",upload.single("resume"),interviewController)



module.exports = interViewrouter;