const {PDFParse} = require('pdf-parse');
const AppError = require('../utils/error.utils.js');
const InterViewReportModel = require('../model/interViewReport.model.js');
const GenerateInterviewReport = require('../services/ai.service.js');

async function interviewController(req, res, next) {
    try {

        // BUG FIX 1: Check file BEFORE destructuring
        if (!req.file) {
            return next(new AppError("You must upload your CV/resume", 400));
        }

        // BUG FIX 2: PDFParser is a function, not a class — call it directly
        const resumeContent = new PDFParse({ data: req.file.buffer });
        const resumedata = await resumeContent.getText();

        if (!resumeContent || !resumedata) {
            return next(new AppError("Can't read this file or it's empty", 400));
        }

        const resumeText = resumedata.text;

        const { jobDescription, selfDescription } = req.body;

        if (!jobDescription) {
            return next(new AppError("Job description is required", 400));
        }

        const aiReport = await GenerateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        });

        console.log(aiReport);

        const interViewReport = await InterViewReportModel.create({
            jobDescription,
            resumeText,
            selfDescription,
            ...aiReport,
            user:req.user.id,
        });

        if (!interViewReport) {
            return next(new AppError("Can't generate report", 400));
        }

        return res.status(201).json({
  success: true,
  message: "Interview report generated successfully",
  report: interViewReport
});

    } catch (err) {
        // BUG FIX 3: console.log was AFTER return, so it never ran
        console.error("Error:", err.message);
        return next(new AppError(err.message, 500));
    }
}

async function getInterviewByIdController(req,res,next) {
  
  const { interviewId } = req.params;
  if (!interviewId) {
    return next(new AppError("Id not found",404))
  }
  const interviewReport = await InterViewReportModel.findOne({
    _id:interviewId,user:req.user.id
  }).select("-__v,-createdAt,");
  if (!interviewReport) {
    return next(new AppError("You don't have any report",404))
  }
  
  res.status(200).json({ 
    success:true,
    message:"Interview report fetched successfully",
    report:interviewReport
  });
}

async function getAllInterViewReportsController(req,res,next) {
  
  
  
}

module.exports = {interviewController,getInterviewByIdController,getAllInterViewReportsController};