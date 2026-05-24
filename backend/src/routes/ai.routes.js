const express = require('express');
const isLogedIn = require('../middleware/auth.middleware.js')
const {
  interviewController,getInterviewByIdController,
  getAllInterViewReportsController
} = require('../controllers/interView.controller.js')

const upload = require('../middleware/file.middleware.js')


const interViewrouter = express.Router();

interViewrouter.post("/",isLogedIn,upload.single("resume"),interviewController)
interViewrouter.get("/:interviewId",getInterviewByIdController)
interViewrouter.get("/allInterviewReports",isLogedIn,getAllInterViewReportsController)


module.exports = interViewrouter;