const { GoogleGenAI } = require ("@google/genai");
const  { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");



const interviewReportSchema = z.object({
  technicalQuestions: z.array(
    z.object({
      question: z
        .string()
        .describe(
          "A technical interview question related to the candidate's skills, projects, technologies, or job description."
        ),

      intention: z
        .string()
        .describe(
          "Explain why the interviewer is asking this question and what skill or knowledge they want to evaluate."
        ),

      answer: z
        .string()
        .describe(
          "A detailed ideal answer explaining important concepts, key points to cover, examples to mention, and the best way to answer the question."
        ),
    })
  ).describe(
    "List of technical interview questions with interviewer intention and ideal answers."
  ),

  behavioralQuestions: z.array(
    z.object({
      question: z
        .string()
        .describe(
          "A behavioral interview question related to communication, teamwork, leadership, problem-solving, or work experience."
        ),

      intention: z
        .string()
        .describe(
          "Explain what behavior, personality trait, or soft skill the interviewer wants to evaluate."
        ),

      answer: z
        .string()
        .describe(
          "A professional answer with examples, proper explanation, and structured response using real situations if possible."
        ),
    })
  ).describe(
    "List of behavioral interview questions with interviewer intention and ideal answers."
  ),

  skillGaps: z.array(
    z.object({
      skill: z
        .string()
        .describe(
          "A missing skill, weak area, or improvement area identified from the candidate profile and job description."
        ),

      severity: z
        .enum(["low", "medium", "high"])
        .describe(
          "Importance level of the skill gap. Use low, medium, or high."
        ),
    })
  ).describe(
    "List of skill gaps and weak areas that the candidate should improve."
  ),

  preparationPlan: z.array(
    z.object({
      day: z
        .number()
        .describe(
          "Preparation day number."
        ),

      focus: z
        .string()
        .describe(
          "Main topic or area to focus on for the day."
        ),

      tasks: z.array(
        z.string().describe(
          "A preparation task or activity to complete."
        )
      ).describe(
        "List of tasks to complete for the day."
      ),
    })
  ).describe(
    "Day-wise interview preparation roadmap with focus topics and tasks."
  ),
});







// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({
  apiKey:process.env.GEMINI_API_KEY
});


async function GenerateInterviewReport({resume, selfDescription,jobDescription}) {
  
  
  const prompt = `
Generate a detailed interview report for a candidate based on the following information.

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

Instructions:
1. Analyze the candidate's resume carefully.
2. Compare the candidate's skills with the job description.
3. Understand the candidate's strengths, weaknesses, and skill gaps.
4. Generate technical interview questions relevant to the job role and candidate profile.
5. Generate behavioral interview questions to evaluate communication, teamwork, and problem-solving abilities.
6. For every question, explain:
   - Why the interviewer may ask this question
   - What an ideal answer should include
   - Important points the candidate should cover
7. Identify missing skills or weak areas.
8. Assign severity levels for each skill gap:
   - low
   - medium
   - high
9. Create a structured day-wise preparation roadmap for the candidate.
10. The preparation roadmap should include:
   - Day number
   - Focus topic
   - List of tasks
11. Keep the response professional, structured, and detailed.
`;
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
    responseFormat: { text: { mimeType: "application/json", schema: zodToJsonSchema(interviewReportSchema) } },
  },
  });
 // console.log(response.text);
console.log(JSON.parse(response.text));
}


module.exports = GenerateInterviewReport;