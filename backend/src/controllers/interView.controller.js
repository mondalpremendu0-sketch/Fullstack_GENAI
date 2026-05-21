const { PDFParse } = require ('pdf-parse');

async function interviewController(req,res)
{
  const {resume} = req.file;
  const resumeContent = new PDFParse({ data: req.file.buffer });
  const resumeText = await resumeContent.getText();
  //console.log(resumeText.text);
  
  
  res.json({ 
    text:resumeText.text
  });
}

module.exports = interviewController;