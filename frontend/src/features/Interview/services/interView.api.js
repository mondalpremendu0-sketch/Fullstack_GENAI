import axios from "axios";

const interviewApi = new axios.create({
  baseUrl : "http://localhost:3000",
  withCrendials: true,
})


export const generateInterviewReport = async ({jobDescription, selfDescription,resumeFile}) => 
{
  const fromData = new FormData();
  fromData.append("jobDescription",jobDescription);
  fromData.append("selfDescription",selfDescription);
  fromData.append("resume",resumeFile);
  try {

    const response = await interviewApi.post("/api/interview/",fromData,{
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


