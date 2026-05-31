// 1. HIJACK THE MODULE AND EXPOSE THE MOCK EXPLICITLY
jest.mock('@google/genai', () => {
    const mockGenContent = jest.fn();
    return {
        GoogleGenAI: jest.fn().mockImplementation(() => {
            return {
                models: {
                    generateContent: mockGenContent
                }
            };
        }),
        mockGenerateContent: mockGenContent 
    };
});

// 2. IMPORT EVERYTHING
const { GenerateInterviewReport, generateResumeHTML } = require('../services/ai.service');
const { mockGenerateContent } = require('@google/genai');

describe("AI Service - GenerateInterviewReport", () => {
    
    afterEach(() => {
        jest.restoreAllMocks(); // Cleans up the console.error spies
    });

    it("should successfully map arrays and apply type fallbacks", async () => {
        const defaultJson = {
            title: 12345,
            matchScore: "High",
            technicalQuestions: [{ question: "Q", intention: "I", answer: "A" }],
            behavioralQuestions: [{ question: "Q" }],
            skillGaps: [{ skill: "S", severity: "critical" }],
            preparationPlan: [{ focus: "F", tasks: ["T"] }]
        };
        
        // EXPLICIT MOCK IMPLEMENTATION (Bulletproof!)
        mockGenerateContent.mockImplementation(async () => ({ 
            text: `\`\`\`json\n${JSON.stringify(defaultJson)}\n\`\`\`` 
        }));

        const result = await GenerateInterviewReport("fake", "fake", "fake");
        
        expect(result.title).toBe(""); 
        expect(result.matchScore).toBe(80); 
        expect(result.technicalQuestions.length).toBe(1);
    });

    it("should throw an error if the formatted data fails Zod schema validation", async () => {
        const badJson = { technicalQuestions: [ { question: { BAD: "OBJECT" } } ] };
        
        mockGenerateContent.mockImplementation(async () => ({ 
            text: `\`\`\`json\n${JSON.stringify(badJson)}\n\`\`\`` 
        }));

        jest.spyOn(console, 'error').mockImplementation(() => {});

        try {
            await GenerateInterviewReport("fake", "fake", "fake");
            throw new Error("TEST_FAILED");
        } catch (err) {
            if (err.message.includes("TEST_FAILED")) throw err;
            expect(err.message).toBe("Invalid AI response structure");
        }
    });

    it("should hit the catch block if the Google API crashes", async () => {
        mockGenerateContent.mockImplementation(async () => {
            throw new Error("Google API is down!");
        });

        try {
            await GenerateInterviewReport("fake", "fake", "fake");
            throw new Error("TEST_FAILED");
        } catch (err) {
            if (err.message.includes("TEST_FAILED")) throw err;
            expect(err.message).toBe("Google API is down!");
        }
    });
});

describe("AI Service - generateResumeHTML", () => {
    
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should generate HTML, strip markdown backticks, and return a clean string", async () => {
        
        // Explicitly resolve the mock!
        mockGenerateContent.mockImplementation(async () => ({ 
            text: "```html\n<div>Fake ATS Resume</div>\n```" 
        }));
        
        // Notice we do NOT mock console.error here! 
        // If your code crashes, the terminal will now print the REAL error.
        const result = await generateResumeHTML("fake", "React", "fake");
        
        expect(result).toBe("<div>Fake ATS Resume</div>");
    });

    it("should hit the catch block and throw a custom error if API crashes", async () => {
        
        mockGenerateContent.mockImplementation(async () => {
            throw new Error("Google API is down!");
        });

        jest.spyOn(console, 'error').mockImplementation(() => {});

        try {
            await generateResumeHTML("fake", "React", "fake");
            throw new Error("TEST_FAILED");
        } catch (err) {
            if (err.message.includes("TEST_FAILED")) throw err;
            expect(console.error).toHaveBeenCalled();
            expect(err.message).toBe("Failed to generate resume HTML");
        }
    });
});