const express = require("express");
const isLogedIn = require("../middleware/auth.middleware.js");
const {
    interviewController,
    getInterviewByIdController,
    getAllInterviewReportsController,
    generateResumeHtmlController
} = require("../controllers/interView.controller.js");
const upload = require("../middleware/file.middleware.js");
const { apiLimiter } = require("../middleware/rateLimiter.middleware.js");

const interViewrouter = express.Router();

interViewrouter.post(
    "/",
    apiLimiter,
    isLogedIn,
    upload.single("resume"),
    interviewController
);
interViewrouter.get(
    "/report/:interviewId",
    apiLimiter,
    isLogedIn,
    getInterviewByIdController
);
interViewrouter.get(
    "/allInterviewReports",
    apiLimiter,
    isLogedIn,
    getAllInterviewReportsController
);
interViewrouter.post(
    "/resume/pdf/:interviewId",
    apiLimiter,
    isLogedIn,
    generateResumeHtmlController
);

module.exports = interViewrouter;
