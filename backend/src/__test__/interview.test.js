const request = require("supertest");
const app = require("../app.js");
const db = require("./setup/db.js");
const InterviewReportModel = require("../model/interViewReport.model.js");

// ---------------------------------------------------------
// THE HIJACK: Intercept the Google GenAI SDK before it runs
// ---------------------------------------------------------
jest.mock("@google/genai", () => {
    return {
        GoogleGenAI: jest.fn().mockImplementation(() => {
            return {
                models: {
                    generateContent: jest.fn().mockResolvedValue({
                        text: `\`\`\`json\n${JSON.stringify({
                            matchScore: 95,
                            prepRoadmap: "A fake study plan.",
                            questions: ["Fake Q1", "Fake Q2"]
                        })}\n\`\`\``,
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

// Notice: We completely removed the jest.mock('pdf-parse') code! 
// Your controller's process.env.NODE_ENV === 'test' block handles it now.

// --- JEST LIFECYCLE HOOKS ---
beforeAll(async () => await db.connect());
afterEach(async () => await db.clearDatabase());
afterAll(async () => await db.closeDatabase());

describe("Interview Generation API", () => {
    // We need a variable to store our auth cookie between tests
    let authCookie;

    beforeAll(async () => {
        // 1. Generate a completely unique email every time this runs!
        const uniqueEmail = `tester_${Date.now()}@example.com`;

        // 2. Register the unique user
        await request(app).post('/api/auth/register').send({
            firstname: "Bulletproof",
            lastname: "Tester",
            email: uniqueEmail,
            password: "password123"
        });

        // 3. Log them in
        const loginRes = await request(app).post('/api/auth/login').send({
            email: uniqueEmail,
            password: "password123"
        });

        // 4. Safely grab the cookie
        authCookie = loginRes.headers['set-cookie'];
    });

    it("should generate an AI report instantly without using real API credits", async () => {
        const fakeResumeBuffer = Buffer.from("This is a fake resume for testing");

        const response = await request(app)
            .post("/api/interview/")
            .set("Cookie", authCookie)
            .field("jobDescription", "Senior React Developer")
            .attach("resume", fakeResumeBuffer, "resume.pdf");

        expect(response.status).toBe(201); 
        expect(response.body.report).toHaveProperty("matchScore");
        expect(response.body.report.matchScore).toBe(95);
    });

    it("should block users who do not have an auth cookie", async () => {
        const response = await request(app)
            .post("/api/interview/")
            .send({ jobDescription: "...", resume: "..." });

        expect(response.status).toBe(401);
    });

    it("should return 400 if no resume is uploaded", async () => {
        const response = await request(app)
            .post("/api/interview/")
            .set("Cookie", authCookie)
            .field("jobDescription", "React Developer");

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("You must upload your CV/resume");
    });
    
    it("should return 400 if job description is missing", async () => {
        const fakePdfBuffer = Buffer.from("fake pdf content");

        const response = await request(app)
            .post("/api/interview/")
            .set("Cookie", authCookie)
            .attach("resume", fakePdfBuffer, "resume.pdf");

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Job description is required");
    });

    it("should return 400 if the report cannot be generated", async () => {
        const createMock = jest.spyOn(InterviewReportModel, "create").mockResolvedValue(null);

        const response = await request(app)
            .post("/api/interview/")
            .set("Cookie", authCookie)
            .field("jobDescription", "React Developer")
            .attach("resume", Buffer.from("fake pdf"), "resume.pdf");

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Can't generate report");

        createMock.mockRestore();
    });

    it("should return 500 if the server crashes during generation", async () => {
        const crashMock = jest.spyOn(InterviewReportModel, "create").mockRejectedValue(new Error("AI Database Crash!"));

        const response = await request(app)
            .post("/api/interview/")
            .set("Cookie", authCookie)
            .field("jobDescription", "React Developer")
            .attach("resume", Buffer.from("fake pdf"), "resume.pdf");

        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("AI Database Crash!");

        crashMock.mockRestore();
    });
    
    // 🔥 THE FIX: Using the secret password buffer instead of a variable!
    it("should return 400 if the uploaded resume is empty or unreadable", async () => {
        const emptyBuffer = Buffer.from("TRIGGER_EMPTY_PDF"); 

        const response = await request(app)
            .post('/api/interview/')
            .set('Cookie', authCookie)
            .field('jobDescription', 'React Developer')
            .attach('resume', emptyBuffer, 'blank.pdf');

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Can't read this file or it's empty");
    });

    describe("GET /api/interview/report/:interviewId", () => {
        it("should return 200 and the specific report", async () => {
            const findMock = jest.spyOn(InterviewReportModel, "findOne").mockReturnValue({
                select: jest.fn().mockResolvedValue({
                    _id: "fake_id_123",
                    jobDescription: "Senior React Dev"
                })
            });

            const response = await request(app)
                .get("/api/interview/report/fake_id_123")
                .set("Cookie", authCookie);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Interview report fetched successfully");
            expect(response.body.report.jobDescription).toBe("Senior React Dev");

            findMock.mockRestore();
        });

        it("should return 400 if the report does not exist", async () => {
            const findMock = jest.spyOn(InterviewReportModel, "findOne").mockReturnValue({
                select: jest.fn().mockResolvedValue(null)
            });

            const response = await request(app)
                .get("/api/interview/report/invalid_id_456")
                .set("Cookie", authCookie);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("You don't have any report");

            findMock.mockRestore();
        });
    });

    describe("GET /api/interview/ (User Dashboard)", () => {
        let authCookie; 

        beforeAll(async () => {
            const uniqueEmail = `dash_${Date.now()}@example.com`; // Unique email for dashboard user
            await request(app).post("/api/auth/register").send({
                firstname: "Dashboard",
                lastname: "User",
                email: uniqueEmail,
                password: "password123"
            });
            const loginRes = await request(app).post("/api/auth/login").send({
                email: uniqueEmail,
                password: "password123"
            });
            authCookie = loginRes.headers["set-cookie"]; 
        });

        it("should fetch all interview reports for the authenticated user", async () => {
            const response = await request(app)
                .get("/api/interview/allInterviewReports")
                .set("Cookie", authCookie);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });

        it("should block users who try to view the dashboard without being logged in", async () => {
            const response = await request(app).get("/api/interview/allInterviewReports");
            expect(response.status).toBe(401);
        });
        
        it('should return 400 if Mongoose returns null for reports', async () => {
            const nullMock = jest.spyOn(InterviewReportModel, 'find').mockReturnValue({
                select: jest.fn().mockResolvedValue(null)
            });

            const response = await request(app)
                .get('/api/interview/allInterviewReports')
                .set('Cookie', authCookie);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Reports not found!");

            nullMock.mockRestore();
        });
    });
});