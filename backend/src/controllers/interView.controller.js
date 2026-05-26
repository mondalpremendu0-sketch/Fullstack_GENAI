const {PDFParse} = require('pdf-parse');
const AppError = require('../utils/error.utils.js');
const InterViewReportModel = require('../model/interViewReport.model.js');
const GenerateInterviewReport = require('../services/ai.service.js');

async function interviewController(req, res, next) {
    try {
     // console.log(req.file);
     // console.log(req.body);
        if (!req.file) {
            return next(new AppError("You must upload your CV/resume", 400));
        }

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

        //console.log(aiReport);

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
        console.error("Error:", err.message);
        return next(new AppError(err.message, 500));
    }
}

async function getInterviewByIdController(req,res,next) {
  
  const { interviewId } = req.params;
  console.log(interviewId);
  if (!interviewId) {
    return next(new AppError("Id not found",400))
  }
  const interviewReport = await InterViewReportModel.findOne({
    _id:interviewId
  }).select("-__v -createdAt -updatedAt");
  
  if (!interviewReport) {
    return next(new AppError("You don't have any report",400))
  }
  
  res.status(200).json({ 
    success:true,
    message:"Interview report fetched successfully",
    report:interviewReport
  });
}

async function getAllInterViewReportsController(req,res,next) {
  
  if(!req.user.id){
    return next(new AppError("User Id not found",400))
  }
  
  const interviewReports = await InterViewReportModel.find({
    user:req.user.id
  }).select("-resume -jobDescription -resumeText -selfDescription -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan -__v,-createdAt -updatedAt")
  
  if (!interviewReports) {
    return next(new AppError("Reports not found!",400))
  }
  
  res.status(200).json({ 
    success:true,
    message:"Reports fetched!",
    reports:interviewReports
  });
  
}


module.exports = {interviewController,getInterviewByIdController,getAllInterViewReportsController};