const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");

const interviewReportSchema = z.object({
    matchScore: z.number().min(0).max(100),
    technicalQuestions: z.array(z.object({
        question: z.string(),
        intention: z.string(),
        answer: z.string()
    })),
    behavioralQuestions: z.array(z.object({
        question: z.string(),
        intention: z.string(),
        answer: z.string()
    })),
    skillGaps: z.array(z.object({
        skill: z.string(),
        severity: z.enum(["low", "medium", "high"])
    })),
    preparationPlan: z.array(z.object({
        day: z.number(),
        focus: z.string(),
        tasks: z.array(z.string())
    })),
    title:z.string()
});

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function GenerateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `
You are an expert technical interview coach. Analyze the candidate and return ONLY a valid JSON object.

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

Return EXACTLY this JSON structure with NO extra text, NO markdown, NO code blocks:

{
  "matchScore": <number 0-100>,
  "technicalQuestions": [
    {
      "question": "<specific technical question>",
      "intention": "<why this question is being asked>",
      "answer": "<ideal answer outline>"
    }
  ],
  "behavioralQuestions": [
    {
      "question": "<specific behavioral question>",
      "intention": "<why this question is being asked>",
      "answer": "<ideal answer outline>"
    }
  ],
  "skillGaps": [
    {
      "skill": "<skill name>",
      "severity": "<low or medium or high>"
    }
  ],
  "preparationPlan": [
    {
      "day": 1,
      "focus": "<focus topic>",
      "tasks": ["<task 1>", "<task 2>", "<task 3>"]
    }
  ],
  "title":"Backend Developer"
}

Rules:
- technicalQuestions: exactly 5 objects
- behavioralQuestions: exactly 5 objects
- skillGaps: exactly 4 objects, severity must be "low", "medium", or "high"
- preparationPlan: exactly 5 objects with day numbers 1 to 10
- Every field must be a plain string
- Do NOT nest arrays inside tasks, tasks must be flat strings
- Return ONLY the JSON object, nothing else
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });

        //console.log("RAW GEMINI:", response.text);

        // Striping any accidental markdown fences
        const cleaned = response.text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const parsedData = JSON.parse(cleaned);

        // Safely map with fallbacks
        const formattedData = {
            matchScore: typeof parsedData.matchScore === "number"
                ? parsedData.matchScore
                : 80,

            technicalQuestions: (parsedData.technicalQuestions || []).map(q => ({
                question: q.question || "",
                intention: q.intention || "Evaluate technical knowledge",
                answer: q.answer || "Explain with practical examples."
            })),

            behavioralQuestions: (parsedData.behavioralQuestions || []).map(q => ({
                question: q.question || "",
                intention: q.intention || "Evaluate communication skills",
                answer: q.answer || "Explain with practical examples."
            })),

            skillGaps: (parsedData.skillGaps || []).map(s => ({
                skill: s.skill || "",
                severity: ["low", "medium", "high"].includes(s.severity)
                    ? s.severity
                    : "medium"
            })),

            preparationPlan: (parsedData.preparationPlan || []).map((plan, index) => ({
                day: index + 1,
                focus: plan.focus || "Preparation",
                tasks: Array.isArray(plan.tasks) && plan.tasks.length > 0
                    ? plan.tasks.map(t => String(t))
                    : ["Review and practice"]
            }))
        };

       // console.log("FORMATTED:", JSON.stringify(formattedData, null, 2));

        const validatedData = interviewReportSchema.safeParse(formattedData);

        if (!validatedData.success) {
            console.error("Validation errors:", validatedData.error.format());
            throw new Error("Invalid AI response structure");
        }

        return validatedData.data;

    } catch (err) {
        console.error("Gemini Error:", err);
        throw err;
    }
}

module.exports = GenerateInterviewReport;