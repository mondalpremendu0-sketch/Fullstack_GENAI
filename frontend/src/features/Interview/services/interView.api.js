import axios from "axios";

const interviewApi = new axios.create({
  baseUrl : "http://localhost:3000",
  withCrendials: true,
})


export const reportData = async ({jobDescription, selfDescription,resume}) => 
{
  try {
    const response = await interviewApi.post("/api/interview",{
      jobDescription, selfDescription,resume
    })
    return response.data;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  } 
  
}
