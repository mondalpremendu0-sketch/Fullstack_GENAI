const express = require('express');
const isLogedIn = require('../middleware/auth.middleware.js')
const {
  interviewController,getInterviewByIdController,
  getAllInterViewReportsController,
  generateResumeHtmlController
} = require('../controllers/interView.controller.js')

const upload = require('../middleware/file.middleware.js')


const interViewrouter = express.Router();

interViewrouter.post("/",isLogedIn,upload.single("resume"),interviewController)
interViewrouter.get("/report/:interviewId",isLogedIn,getInterviewByIdController)
interViewrouter.get("/allInterviewReports",isLogedIn,getAllInterViewReportsController)
interViewrouter.post("/resume/pdf/:interviewId",isLogedIn,generateResumeHtmlController)


module.exports = interViewrouter;



