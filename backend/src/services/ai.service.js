const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const normalizeItem = require("../helper/normalize.js");

const interviewReportSchema = z.object({
    matchScore: z.number().min(0).max(100),

    technicalQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string()
        })
    ),

    behavioralQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string()
        })
    ),

    skillGaps: z.array(
        z.object({
            skill: z.string(),
            severity: z.enum(["low", "medium", "high"])
        })
    ),

    preparationPlan: z.array(
        z.object({
            day: z.number(),
            focus: z.string(),
            tasks: z.array(z.string())
        })
    )
});

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function GenerateInterviewReport({
    resume,
    selfDescription,
    jobDescription
}) {
    //console.log({Resume,SelfDescription,JobDescription});
    const prompt = `
Analyze the candidate using:

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

Return ONLY valid JSON matching the schema.

Requirements:
- technicalQuestions must contain objects
- behavioralQuestions must contain objects
- skillGaps must contain objects
- preparationPlan must contain objects
- No XML tags
- No markdown
- No explanations
- No extra keys
`;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: zodToJsonSchema(interviewReportSchema)
            }
        });
        //  console.log(JSON.parse(response.text));
       // console.log("Gemini replay>>", response.text);
        const parsedData = JSON.parse(response.text);

        const formattedData = {
            matchScore: parsedData.matchScore || 80,

            technicalQuestions: Array.isArray(parsedData.technicalQuestions)
                ? parsedData.technicalQuestions.map(q => {
                      const item = normalizeItem(q);

                      return {
                          question: item.question || "",

                          intention:
                              item.reasoning ||
                              (Array.isArray(item.focus)
                                  ? item.focus.join(", ")
                                  : item.focus) ||
                              "Evaluate technical knowledge",

                          answer: "Candidate should explain clearly with examples"
                      };
                  })
                : [],

            behavioralQuestions: Array.isArray(parsedData.behavioralQuestions)
                ? parsedData.behavioralQuestions.map(q => {
                      const item = normalizeItem(q);

                      return {
                          question: item.question || "",

                          intention:
  item.reasoning ||
  (
    Array.isArray(item.focus)
      ? item.focus.join(", ")
      : item.focus
  ) ||
  "Evaluate communication skills",

                          answer: "Candidate should answer using STAR method"
                      };
                  })
                : [],

            skillGaps: Array.isArray(parsedData.skillGaps)
                ? parsedData.skillGaps.map(skill => {
                      const item = normalizeItem(skill);

                      return {
                          skill: item.skill || skill,

                          severity: "medium"
                      };
                  })
                : [],

            preparationPlan: Array.isArray(parsedData.preparationPlan)
                ? parsedData.preparationPlan.map((plan, index) => {
                      const item = normalizeItem(plan);

                      return {
                          day: index + 1,

                          focus:
                              item.category ||
                              item.area ||
                              item.focus ||
                              "Preparation",

                          tasks: item.items || [item.suggestion || plan]
                      };
                  })
                : []
        };

        const validatedData = interviewReportSchema.safeParse(formattedData);

        if (!validatedData.success) {
            console.log(validatedData.error.format());

            throw new Error("Invalid AI response structure");
        }

        return validatedData.data;
    } catch (err) {
        console.error("Gemini Error:", err);
        throw err;
    }
}

module.exports = GenerateInterviewReport;
