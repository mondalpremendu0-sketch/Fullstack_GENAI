import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";


const interviewReportSchema = z.object({
  technicalQuestions: z.array(
    z.object({
      question: z
        .string()
        .description(
          "The technical question that can be asked in the interview"
        ),

      intention: z
        .string()
        .description(
          "The intention of interviewer behind asking this question"
        ),

      answer: z
        .string()
        .description(
          "How to answer this question, what points to cover, and what approach to follow"
        ),
    })
  ).description(
    "Technical questions that can be asked in the interview along with their intention and answers"
  ),

  behavioralQuestions: z.array(
    z.object({
      question: z
        .string()
        .description(
          "The behavioral question that can be asked in the interview"
        ),

      intention: z
        .string()
        .description(
          "The intention of interviewer behind asking this behavioral question"
        ),

      answer: z
        .string()
        .description(
          "How to answer this behavioral question with proper examples and structure"
        ),
    })
  ).description(
    "Behavioral questions that can be asked in the interview along with their intention and answers"
  ),

  skillGaps: z.array(
    z.object({
      skill: z
        .string()
        .description(
          "The skill where the candidate needs improvement"
        ),

      severity: z
        .enum(["low", "medium", "high"])
        .description(
          "Severity level of the skill gap"
        ),
    })
  ).description(
    "List of missing or weak skills identified during interview analysis"
  ),

  preparationPlan: z.array(
    z.object({
      day: z
        .number()
        .description(
          "Preparation day number"
        ),

      focus: z
        .string()
        .description(
          "Main topic or focus area for the day"
        ),

      tasks: z.array(
        z.string().description(
          "Specific preparation task to complete"
        )
      ).description(
        "List of tasks for the preparation day"
      ),
    })
  ).description(
    "Day-wise preparation roadmap for interview improvement"
  ),
});






// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({
  apiKey:process.env.GEMINI_API_KEY
});


async function invokeGeminiAi() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Explain how AI works in a few words",
  });
  console.log(response.text);
  return response.text;
}



module.exports = GenerateContent;