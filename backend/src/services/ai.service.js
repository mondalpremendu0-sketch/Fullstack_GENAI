const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const AppError = require("../utils/error.utils.js");

const interviewReportSchema = z.object({
    title: z.string(),
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

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function GenerateInterviewReport({
    resume,
    selfDescription,
    jobDescription
}) {
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
   "title":"Backend Enginner",
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
 
}

Rules:
- technicalQuestions: exactly 5 objects
- behavioralQuestions: exactly 5 objects
- skillGaps: exactly 5 objects, severity must be "low", "medium", or "high"
- preparationPlan: exactly 7 objects with day numbers 1 to 7
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

        const cleaned = response.text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const parsedData = JSON.parse(cleaned);

        // Safely map with fallbacks
        const formattedData = {
            title: typeof parsedData.title === "string" ? parsedData.title : "",
            matchScore:
                typeof parsedData.matchScore === "number"
                    ? parsedData.matchScore
                    : 80,

            technicalQuestions: (parsedData.technicalQuestions || []).map(
                q => ({
                    question: q.question || "",
                    intention: q.intention || "Evaluate technical knowledge",
                    answer: q.answer || "Explain with practical examples."
                })
            ),

            behavioralQuestions: (parsedData.behavioralQuestions || []).map(
                q => ({
                    question: q.question || "",
                    intention: q.intention || "Evaluate communication skills",
                    answer: q.answer || "Explain with practical examples."
                })
            ),

            skillGaps: (parsedData.skillGaps || []).map(s => ({
                skill: s.skill || "",
                severity: ["low", "medium", "high"].includes(s.severity)
                    ? s.severity
                    : "medium"
            })),

            preparationPlan: (parsedData.preparationPlan || []).map(
                (plan, index) => ({
                    day: index + 1,
                    focus: plan.focus || "Preparation",
                    tasks:
                        Array.isArray(plan.tasks) && plan.tasks.length > 0
                            ? plan.tasks.map(t => String(t))
                            : ["Review and practice"]
                })
            )
        };

        const validatedData = interviewReportSchema.safeParse(formattedData);

        if (!validatedData.success) {
            console.error("Validation errors:", validatedData.error.format());
            throw new Error("Invalid AI response structure");
        }

        return validatedData.data;
    } catch (err) {
        return next(new AppError(err.message, 500));
        throw err;
    }
}

async function generateResumeHTML(resumeText, jobTitle, selfDescription) {
    const prompt = `
You are an expert ATS resume writer and frontend web developer. Your task is to generate a professional, one-page ATS-friendly resume using ONLY pure HTML and inline CSS.

### CRITICAL OUTPUT RULES:
1. Return ONLY valid HTML. 
2. Do NOT wrap the output in markdown code blocks (no \`\`\`html).
3. Do NOT include any conversational text, explanations, or filler. 

### REACT & PDF COMPATIBILITY RULES:
- Do NOT place any styles (font-family, color, background-color) on the <html> or <body> tags. 
- You MUST wrap the entire resume in a master container: <div style="font-family: Arial, Helvetica, sans-serif; max-width: 794px; background-color: #ffffff; color: #333333; padding: 40px; margin: 0 auto; line-height: 1.5; box-sizing: border-box;">
- Use precise CSS to ensure it fits on exactly one page. Keep margins tight and font sizes professional (e.g., 14px to 16px for body text).

### ATS (APPLICANT TRACKING SYSTEM) RULES:
- Use semantic HTML tags strictly in order: <h1> for the name, <h2> for section headers, <h3> for job/project titles. ATS bots rely on these tags to parse information.
- Do NOT use HTML <table> tags for layout. Use simple CSS Flexbox for sections like "Skills".
- Do NOT use complex CSS grids, absolute positioning, or multi-column layouts for the main text flow. Keep the reading order logical from top to bottom.

### CONTENT & DESIGN RULES:
- Enforce strict brevity to guarantee a one-page layout. Condense verbose descriptions into punchy, impact-driven bullet points.
- Section Headers (<h2>) must have a clean bottom border accent (e.g., border-bottom: 2px solid #0056b3; display: inline-block;).
- Highlight key technologies and metrics using a subtle accent color (e.g., <strong style="color: #0056b3;">).
- Optimize the layout and phrasing specifically for the target job title: "${jobTitle}"

### CANDIDATE DATA:
Resume Core Content:
${resumeText}

Candidate Self Description:
${selfDescription}

Generate the complete HTML document now.
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        
        let html = `${response.text}`;
         html = html.replace(/^```html\n?/, '').replace(/\n?```$/, '').trim()
        return html;
    } catch (error) {
        console.error("Resume HTML Generation Error:", error);
        throw new Error("Failed to generate resume HTML");
    }
}

module.exports = {GenerateInterviewReport,generateResumeHTML};
