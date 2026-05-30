const request = require("supertest");
const app = require("../app.js");
const db = require("./setup/db.js");

// ---------------------------------------------------------
// THE HIJACK: Intercept the Google GenAI SDK before it runs
// ---------------------------------------------------------
// 1. THE HIJACK: Intercept the Google GenAI SDK
jest.mock("@google/genai", () => {
    return {
        GoogleGenAI: jest.fn().mockImplementation(() => {
            return {
                models: {
                    generateContent: jest.fn().mockResolvedValue({
                        // The new SDK exposes the text directly as a string property!
                        // This string contains the fake markdown we need to test your .replace() logic
                        text: `\`\`\`json\n${JSON.stringify({
                            matchScore: 95,
                            prepRoadmap: "A fake study plan.",
                            questions: ["Fake Q1", "Fake Q2"]
                        })}\n\`\`\``,

                        // Just in case your code uses the older response.text() format, we provide it here too:
                        response: {
                            text: () =>
                                `\`\`\`json\n${JSON.stringify({
                                    matchScore: 95,
                                    prepRoadmap: "A fake study plan.",
                                    questions: ["Fake Q1", "Fake Q2"]
                                })}\n\`\`\``
                        }
                    })
                }
            };
        })
    };
});
jest.mock("pdf-parse", () => {
    return {
        // We must export an object containing the PDFParse constructor
        PDFParse: jest.fn().mockImplementation(() => {
            return {
                // When your controller calls await resumeContent.getText()
                // it will instantly receive this fake data!
                getText: jest.fn().mockResolvedValue({
                    text: "This is the perfectly extracted text of a fake resume."
                })
            };
        })
    };
});

// --- JEST LIFECYCLE HOOKS ---
beforeAll(async () => await db.connect());
afterEach(async () => await db.clearDatabase());
afterAll(async () => await db.closeDatabase());

describe("Interview Generation API", () => {
    // We need a variable to store our auth cookie between tests
    let authCookie;

    // Before we test the AI, we MUST create a user and log in to get past the bouncer
    beforeEach(async () => {
        const credentials = {
            email: "ai_tester@example.com",
            password: "password123",
            firstname: "Tester",
            lastname: "User"
        };

        // 1. Register the user
        await request(app).post("/api/auth/register").send(credentials);

        // 2. Log in and steal the cookie!
        const loginRes = await request(app)
            .post("/api/auth/login")
            .send(credentials);
        authCookie = loginRes.headers["set-cookie"]; // Grab the HttpOnly cookie
    });

    it("should generate an AI report instantly without using real API credits", async () => {
        // Create a fake file in memory
        const fakeResumeBuffer = Buffer.from(
            "This is a fake resume for testing"
        );

        const response = await request(app)
            // Make sure this route matches your actual route exactly!
            // Your console log said '/api/interview/' so I used that here:
            .post("/api/interview/")
            .set("Cookie", authCookie) // Present the cookie to the bouncer
            .field("jobDescription", "Senior React Developer") // Send standard text fields
            .attach("resume", fakeResumeBuffer, "resume.pdf"); // Fake a file upload!
        
        // 1. Assert the request succeeded
        expect(response.status).toBe(201); // Based on your test, you expect a 201

        // 2. Assert the AI returned our fake data, not a real Google response
        expect(response.body.report).toHaveProperty("matchScore");
        expect(response.body.report.matchScore).toBe(95);
    });

    it("should block users who do not have an auth cookie", async () => {
        const response = await request(app)
            .post("/api/interview/")
            // Notice we do NOT attach the cookie here
            .send({ jobDescription: "...", resume: "..." });

        // The bouncer should kick them out

        expect(response.status).toBe(401);
    });
    
    // ... your existing POST /api/interview/ tests are up here ...

    describe('GET /api/interview/ (User Dashboard)', () => {
        
        it('should fetch all interview reports for the authenticated user', async () => {
            const response = await request(app)
                .get('/api/interview/allInterviewReports')
                .set('Cookie', authCookie); // Present the VIP card!

            // 1. Assert the request succeeded
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            
            // 2. Assert the payload shape
            /*expect(response.body).toHaveProperty('count');
            expect(response.body).toHaveProperty('data');
            expect(Array.isArray(response.body.data)).toBe(true);
            */
        });

        it('should block users who try to view the dashboard without being logged in', async () => {
            const response = await request(app)
                .get('/api/interview/allInterviewReports'); // Notice we do NOT attach the cookie here

            // The bouncer should kick them out
            expect(response.status).toBe(401);
        });
    });
});
