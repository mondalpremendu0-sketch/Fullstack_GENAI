const { PDFParse } = require ('pdf-parse');
const AppError = require('../utils/error.utils.js')
const InterViewReportModel = require('../model/interViewReport.model.js')
const GenerateInterviewReport = require('../services/ai.service.js')





async function interviewController(req,res,next)
{
  try {
    
    const {resume} = req.file;
    if (!req.file){
      return next(new AppError("you must upload  you cv/resume",401));
    }

//TO READ OR EXTRACT THE PDF FILE:  
  const resumeContent = new PDFParse({ data: req.file.buffer });
  const resumeText = await resumeContent.getText();
  
  if (!resumeText) {
    return next(new AppError("I can't read this file or its empty",401));
  }
  //console.log(resumeText.text);
  const {jobDescription,selfDescription} = req.body;
  if (!jobDescription) {
    return next(new AppError("Job descriptions is required",401))
  }
  
  const aiReport = await GenerateInterviewReport({
    resume:resumeText.text,
    selfDescription,
    jobDescription
  })
  console.log(aiReport);
  
  
  const interViewReport = await InterViewReportModel.create({
    jobDescription,
    resumeText:resumeText.text,
    selfDescription,
    ...aiReport,
    //user:req.user.id
  })
  //console.log(interViewReport);
  if (!interViewReport) {
    return next(new AppError("Can't generate report",401))
  }
  
  res.status(201).json({ 
    success:true,
    message:"Report generated successfully ",
    roport:interViewReport
  });

  } catch (err) {
    return next(new AppError(err.message,500));
   console.log("err: ",err.message);
    
  }
}
module.exports = interviewController;