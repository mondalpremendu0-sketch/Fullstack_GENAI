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
        
        throw err;
    }
}

async function generateResumeHTML(resumeText, jobTitle, selfDescription) {
    const prompt = `
You are an expert ATS resume writer and frontend web developer. Your task is to generate a professional, one-page ATS-friendly resume using ONLY pure HTML and inline CSS.

### CRITICAL OUTPUT RULES (STRICTLY ENFORCED):
1. Return ONLY valid HTML. Do NOT wrap the output in markdown code blocks (no \`\`\`html).
2. Do NOT use Markdown for text formatting. Absolutely NO asterisks (**text**) for bolding. You MUST use the HTML <strong> tag to bold text.
3. Do NOT include any conversational text, explanations, or filler. Just the HTML.
4. The design MUST strictly replicate a classic, serif professional template. Black and white ONLY.
5. STRICT TYPOGRAPHY RULE: You MUST strictly use 'Times New Roman'. Do NOT add 'font-family' inline styles to ANY inner elements (like h1, h2, p, span, or div). Let all text inherit the serif font directly from the master container.

### 1-PAGE FULL-LENGTH SCALING RULES (CRITICAL):
- You MUST wrap the entire resume in this exact master container:
  <div style="font-family: 'Times New Roman', Times,; width: 794px; height: 1122px; background-color: #ffffff; color: #000000; padding: 40px 50px; margin: 0 auto; box-sizing: border-box; font-size: 12.5px; line-height: 1.5; overflow: hidden;">

### STRICT LENGTH CONSTRAINTS (CRITICAL TO PREVENT OVERFLOW):
- **Professional Summary:** MUST be exactly ONE paragraph, spanning strictly 3 to 4 lines.
- **Projects:** Dynamically generate project blocks based on the candidate's data (maximum 3 projects). Generate EXACTLY 3 to 4 bullet points per project. Make them detailed (1 to 2 lines each) explaining architecture and impact, but ensure they do not push the Education section off the page.
- **Education:** This section MUST remain visible at the very bottom of the document.

### STRICT HTML SKELETON:

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 24px;">
    <h1 style="margin: 0 0 4px 0; font-size: 28px; text-transform: uppercase;">[CANDIDATE NAME]</h1>
    <div style="font-size: 12px;">[Location] | [Phone] | [Email] | [LinkedIn] | [GitHub]</div>
</div>

<!-- PROFESSIONAL SUMMARY -->
<div style="margin-bottom: 22px;">
    <h2 style="font-size: 15px; text-transform: uppercase; font-weight: bold; border-bottom: 1px solid #000; margin: 0 0 8px 0; padding-bottom: 4px;">Professional Summary</h2>
    <p style="margin: 0; text-align: justify;">Your concise, 3-4 line summary goes here based on the candidate data.</p>
</div>

<!-- TECHNICAL SKILLS -->
<div style="margin-bottom: 22px;">
    <h2 style="font-size: 15px; text-transform: uppercase; font-weight: bold; border-bottom: 1px solid #000; margin: 0 0 8px 0; padding-bottom: 4px;">Technical Skills</h2>
    <!-- Dynamically group skills based on candidate data -->
    <div style="margin-bottom: 4px;"><strong>[Category 1, e.g., Languages]:</strong> [Skills]</div>
    <div style="margin-bottom: 4px;"><strong>[Category 2, e.g., Frontend]:</strong> [Skills]</div>
    <div style="margin-bottom: 4px;"><strong>[Category 3, e.g., Backend]:</strong> [Skills]</div>
    <div style="margin-bottom: 0;"><strong>[Category 4, e.g., Tools]:</strong> [Skills]</div>
</div>

<!-- PROJECTS -->
<div style="margin-bottom: 22px;">
    <h2 style="font-size: 15px; text-transform: uppercase; font-weight: bold; border-bottom: 1px solid #000; margin: 0 0 8px 0; padding-bottom: 4px;">Projects</h2>
    
    <!-- REPEAT THIS BLOCK FOR EACH PROJECT IN THE CANDIDATE DATA -->
    <!-- Note: For the very last project block, change margin-bottom to 0 -->
    <div style="margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; font-weight: bold;">
            <span style="font-size: 14px;">[Project Name]</span>
            <span>[Tech Stack Summary]</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-style: italic; margin-bottom: 6px; font-size: 12px;">
            <span>[Role / Title]</span>
            <span>[Date / Remote]</span>
        </div>
        <ul style="margin: 0 0 0 20px; padding: 0;">
            <li style="margin-bottom: 4px;">Detailed, 1-2 line bullet point explaining architecture using HTML <strong>[Key Tech]</strong> tags.</li>
            <li style="margin-bottom: 4px;">Detailed, 1-2 line bullet point explaining a complex challenge, implementation, or feature.</li>
            <li style="margin-bottom: 4px;">Detailed, 1-2 line bullet point focusing on performance, metrics, or user impact.</li>
            <!-- Optional 4th bullet point if it fits the length constraints -->
        </ul>
    </div>
    <!-- END REPEAT -->

</div>

<!-- EDUCATION -->
<div style="margin-bottom: 0;">
    <h2 style="font-size: 15px; text-transform: uppercase; font-weight: bold; border-bottom: 1px solid #000; margin: 0 0 8px 0; padding-bottom: 4px;">Education</h2>
    
    <!-- REPEAT FOR EACH DEGREE/INSTITUTION -->
    <div style="margin-bottom: 8px;">
        <div style="display: flex; justify-content: space-between; font-weight: bold;">
            <span style="font-size: 14px;">[Degree Name]</span>
            <span>[Start Year - End Year]</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-style: italic; font-size: 12px;">
            <span>[University / Institution Name]</span>
            <span>[Location]</span>
        </div>
    </div>
    <!-- END REPEAT -->
</div>

### CANDIDATE DATA:
Resume Core Content:
${resumeText}

Candidate Self Description:
${selfDescription}

Generate the complete HTML document now mapping the candidate data to the skeleton placeholders.
`;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        let html = `${response.text}`;
        html = html
            .replace(/^```html\n?/, "")
            .replace(/\n?```$/, "")
            .trim();
        return html;
    } catch (error) {
        console.error("Resume HTML Generation Error:", error);
        throw new Error("Failed to generate resume HTML");
    }
}

module.exports = { GenerateInterviewReport, generateResumeHTML };
