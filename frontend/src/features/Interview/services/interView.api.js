import axios from "axios";

const interviewApi = new axios.create({
  baseURL : "http://localhost:3000",
  withCredentials:true
})


export const generateInterviewReport = async ({jobDescription, selfDescription,resumeFile}) => 
{
  //console.log("resumeFile",resumeFile);
  const formData = new FormData();
  formData.append("jobDescription",jobDescription);
  formData.append("selfDescription",selfDescription);
  formData.append("resume",resumeFile);
  
  //console.log(fromData);
  try {

    const response = await interviewApi.post("/api/interview/",formData,{
    headers:{
      "Content-Type":"multipart/form-data"
    }
  });
  
  return response.data;
    
  } catch (err) {
    console.error('Error:', err);
  }
  
  
  
  
}

export const getInerviewById = async (interviewId) =>
{
  try {
    const response = await interviewApi.get(`/api/interview/report/${interviewId}`);
    
    return response.data;
    
  } catch (err) {
    console.error('api Error:', err);
  }
  
  
}

export const getAllInterviewReport = async () =>
{
  try {
    const response = await interviewApi.get("/api/interview/allInterviewReports");
    
    return response.data;
    
  } catch (err) {
    console.error('Error:', err);
  }
  
  
}


