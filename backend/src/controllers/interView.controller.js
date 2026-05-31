const { PDFParse } = require("pdf-parse");
const AppError = require("../utils/error.utils.js");
const InterViewReportModel = require("../model/interViewReport.model.js");
const {
    GenerateInterviewReport,
    generateResumeHTML
} = require("../services/ai.service.js");
const {aiCache} = require('../middleware/cache.middleware.js')

async function interviewController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError("You must upload your CV/resume", 400));
        }
        
/*
        // 🚨 THE TEST OVERRIDE: Bypass the real parser completely during Jest tests!
        if (process.env.NODE_ENV === "test") {
            // Convert the buffer to a string so we can read it
            const fileString = req.file.buffer.toString();

            // THE FIX: Use .includes() so it ignores any weird Supertest formatting!
            if (fileString.includes("TRIGGER_EMPTY_PDF")) {
                resumedata = "   "; // Force the ghost spaces to test the 400 block
            } else {
                resumedata = "Valid fake resume text"; // Force success for all other tests
            }

            resumeContent = { text: resumedata };
        } 
*/


       const  resumeContent = new PDFParse({ data: req.file.buffer });
        const  resumedata = await resumeContent.getText();
          console.log(resumedata);
        // Safely check the string!
        if (
            !resumeContent || !resumedata
        ) {
            return next(
                new AppError("Can't read this file or it's empty", 400)
            );
        }

        /*
         resumeContent = new PDFParse({ data: req.file.buffer });
        
         resumedata = await resumeContent.getText();
        
        */

        /* if (!resumeContent || !resumedata || typeof resumedata !== "string" ) {
            return next(
                new AppError("Can't read this file or it's empty", 400)
            );
        }
*/
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

        const responseData = {
            success: true,
            message: "Interview report generated successfully",
            report: interViewReport
        };
        
        if (req.cacheKey) {
          aiCache.set(req.cacheKey, responseData);
        }
        
        return res.status(201).json({
            success: true,
            message: "Interview report generated successfully",
            report: interViewReport
        });
    } catch (err) {
        return next(new AppError(err.message, 500));
    }
}

async function getInterviewByIdController(req, res, next) {
    try {
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
    } catch (err) {
        return next(new AppError(err.message, 500));
    }
}

async function getAllInterviewReportsController(req, res, next) {
    //console.log(req.user.id);
    try {
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
    } catch (err) {
        return next(new AppError(err.message, 500));
    }
}

async function generateResumeHtmlController(req, res, next) {
    try {
        const { interviewId } = req.params;
        if (!interviewId) {
            return next(new AppError("Cannot find interview id", 400));
        }

        const interviewReport =
            await InterViewReportModel.findById(interviewId);

        if (!interviewReport) {
            return next(new AppError("Cannot find Interview Report", 400));
        }

        const { resumeText, selfDescription, jobDescription } = interviewReport;

        const htmlText = await generateResumeHTML(
            resumeText,
            selfDescription,
            jobDescription
        );
        //console.log("html text in con: ",htmlText);
        if (!htmlText) {
            return next(new AppError("AI is busy", 400));
        }

        res.status(201).json({
            message: "html created",
            htmlData: htmlText
        });
    } catch (err) {
        return next(new AppError(err.message, 500));
    }
}

module.exports = {
    interviewController,
    getInterviewByIdController,
    getAllInterviewReportsController,
    generateResumeHtmlController
};
