const { PDFParse } = require("pdf-parse");
const AppError = require("../utils/error.utils.js");
const InterViewReportModel = require("../model/interViewReport.model.js");
const {
    GenerateInterviewReport,
    generateResumeHTML
} = require("../services/ai.service.js");

async function interviewController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError("You must upload your CV/resume", 400));
        }

        const resumeContent = new PDFParse({ data: req.file.buffer });
        const resumedata = await resumeContent.getText();

        if (!resumeContent || !resumedata) {
            return next(
                new AppError("Can't read this file or it's empty", 400)
            );
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
            user: req.user.id
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

async function getInterviewByIdController(req, res, next) {
    const { interviewId } = req.params;
    if (!interviewId) {
        return next(new AppError("Id not found", 400));
    }
    const interviewReport = await InterViewReportModel.findOne({
        _id: interviewId
    }).select("-__v -createdAt -updatedAt");

    if (!interviewReport) {
        return next(new AppError("You don't have any report", 400));
    }

    res.status(200).json({
        success: true,
        message: "Interview report fetched successfully",
        report: interviewReport
    });
}

async function getAllInterViewReportsController(req, res, next) {
    //console.log(req.user.id);
    if (!req.user.id) {
        return next(new AppError("User Id not found", 400));
    }

    const interviewReports = await InterViewReportModel.find({
        user: req.user.id
    }).select(
        "-resume -jobDescription -resumeText -selfDescription -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan -__v  -updatedAt"
    );

    if (!interviewReports) {
        return next(new AppError("Reports not found!", 400));
    }

    res.status(200).json({
        success: true,
        message: "Reports fetched!",
        reports: interviewReports
    });
}

async function generateResumeHtmlController(req, res, next) {
    const { interviewId } = req.params;
    if (!interviewId) {
      return next(new AppError("Cannot find interview id",400))
    }
    
    const interviewReport = await InterViewReportModel.findById(interviewId);
    
    if (!interviewReport) {
      return next(new AppError("Cannot find Interview Report",400))
    }
    
    const { resumeText, selfDescription, jobDescription } = interviewReport;
    
    const htmlText = await generateResumeHTML(resumeText, selfDescription, jobDescription)
    //console.log("html text in con: ",htmlText);
    if (!htmlText) {
      return next(new AppError("AI is busy",400))
    }
    
    res.status(201).json({ 
      message:"html created",
      htmlData:htmlText
    });
}

module.exports = {
    interviewController,
    getInterviewByIdController,
    getAllInterViewReportsController,
    generateResumeHtmlController
};
