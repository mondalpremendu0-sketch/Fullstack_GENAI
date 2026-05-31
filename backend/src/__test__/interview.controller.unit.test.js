jest.mock('../services/ai.service.js', () => ({
    generateResumeHTML: jest.fn()
}));
const { generateResumeHTML } = require('../services/ai.service.js');
// 1. THE WARNING FIX: Set a dummy API key BEFORE importing the controller!
process.env.GEMINI_API_KEY = "dummy-test-key-123";

const controllers = require('../controllers/interView.controller.js');
const InterviewReportModel = require('../model/interViewReport.model.js');
const AppError = require('../utils/error.utils.js');

// 2. THE SMART FINDER: Hunt down the functions by their internal JavaScript names!
const findController = (targetName) => {
    // If they exported a single function
    if (typeof controllers === 'function' && controllers.name === targetName) return controllers;
    
    // If they exported an object, search every item inside it
    for (const key in controllers) {
        if (typeof controllers[key] === 'function') {
            if (controllers[key].name === targetName || key === targetName) {
                return controllers[key];
            }
        }
    }
    return null; // Return null if it genuinely doesn't exist
};

// Grab the exact functions we need based on the names we saw in your screenshot!
const interviewController = findController('interviewController');
const getInterviewByIdController = findController('getInterviewByIdController');
const getAllInterviewReportsController = findController('getAllInterviewReportsController');
const generateResumeHtmlController = findController('generateResumeHtmlController');


// 3. Mock the Database
jest.mock('../model/interViewReport.model.js');

// 4. THE PDF-PARSE FIX
jest.mock('pdf-parse', () => {
    const mockParser = jest.fn().mockImplementation(() => {
        return { getText: jest.fn().mockResolvedValue("Real parsed text") };
    });
    return {
        __esModule: true,
        default: mockParser,
        PDFParse: mockParser
    };
});

describe('Interview Controller - Edge Cases', () => {
    let req, res, next;

    beforeEach(() => {
        req = { 
            params: {}, 
            file: { buffer: Buffer.from('test') }, 
            user: { _id: 'user123' }, 
            body: {} 
        };
        res = { 
            status: jest.fn().mockReturnThis(), 
            json: jest.fn() 
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    // PATH 1: The Real PDF Parser
    it('should hit the real PDF parser when NOT in the test environment', async () => {
        if (!interviewController) throw new Error("Could not find interviewController!");
        
        const originalEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'development';

        await interviewController(req, res, next);

        process.env.NODE_ENV = originalEnv;

        expect(next).toHaveBeenCalledWith(expect.any(AppError));
        expect(next.mock.calls[0][0].message).toBe("Job description is required");
    });

    // PATH 2: The Missing Interview ID
    it('should return 400 if interviewId is missing in params', async () => {
        if (!getInterviewByIdController) throw new Error("Could not find getInterviewByIdController!");
        
        req.params = {}; 
        await getInterviewByIdController(req, res, next);
        
        expect(next).toHaveBeenCalledWith(expect.any(AppError));
        expect(next.mock.calls[0][0].message).toBe("Id not found");
        expect(next.mock.calls[0][0].statusCode).toBe(400);
    });

    // PATH 3: The getById Catch Block
    it('should return 500 if the database crashes while fetching one report', async () => {
        if (!getInterviewByIdController) throw new Error("Could not find getInterviewByIdController!");
        
        req.params = { interviewId: '123' };
        
        InterviewReportModel.findOne.mockImplementation(() => {
            throw new Error("DB Crash 1");
        });

        await getInterviewByIdController(req, res, next);
        
        expect(next).toHaveBeenCalledWith(expect.any(AppError));
        expect(next.mock.calls[0][0].message).toBe("DB Crash 1");
        expect(next.mock.calls[0][0].statusCode).toBe(500);
    });

    // PATH 4: The getAll Catch Block
    it('should return 500 if the database crashes while fetching all reports', async () => {
        if (!getAllInterviewReportsController) {
             throw new Error("CRITICAL: The Smart Finder could not locate 'getAllInterviewReportsController' in your module.exports! Please check the bottom of your interView.controller.js file and ensure it is exported.");
        }

        InterviewReportModel.find.mockImplementation(() => {
            throw new Error("DB Crash 2");
        });

        await getAllInterviewReportsController(req, res, next);
        
        expect(next).toHaveBeenCalledWith(expect.any(AppError));
        expect(next.mock.calls[0][0].message).toBe("DB Crash 2");
        expect(next.mock.calls[0][0].statusCode).toBe(500);
    });
});

describe('Interview Controller - generateResumeHtmlController', () => {
    let req, res, next;

    beforeEach(() => {
        req = { params: {} };
        res = { 
            status: jest.fn().mockReturnThis(), 
            json: jest.fn() 
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    // PATH 1: Missing Interview ID (Line 147-149)
    it('should return 400 if interviewId is missing', async () => {
        if (!generateResumeHtmlController) throw new Error("Could not find generateResumeHtmlController!");
        
        req.params = {}; // Empty params
        
        await generateResumeHtmlController(req, res, next);
        
        expect(next).toHaveBeenCalledWith(expect.any(AppError));
        expect(next.mock.calls[0][0].message).toBe("Cannot find interview id");
        expect(next.mock.calls[0][0].statusCode).toBe(400);
    });

    // PATH 2: Report Not Found in Database (Line 154-156)
    it('should return 400 if the interview report does not exist', async () => {
        req.params = { interviewId: 'fake-id-123' };
        
        // Force the database to return null (not found)
        InterviewReportModel.findById.mockResolvedValue(null);
        
        await generateResumeHtmlController(req, res, next);
        
        expect(next).toHaveBeenCalledWith(expect.any(AppError));
        expect(next.mock.calls[0][0].message).toBe("Cannot find Interview Report");
        expect(next.mock.calls[0][0].statusCode).toBe(400);
    });

    // PATH 3: AI Service Returns Null/Empty (Line 166-168)
    it('should return 400 if the AI service fails to generate HTML text', async () => {
        req.params = { interviewId: 'fake-id-123' };
        
        // Mock a valid database report
        InterviewReportModel.findById.mockResolvedValue({
            resumeText: "resume",
            selfDescription: "desc",
            jobDescription: "job"
        });
        
        // Force the AI service to return null!
        generateResumeHTML.mockResolvedValue(null);
        
        await generateResumeHtmlController(req, res, next);
        
        expect(next).toHaveBeenCalledWith(expect.any(AppError));
        expect(next.mock.calls[0][0].message).toBe("AI is busy");
        expect(next.mock.calls[0][0].statusCode).toBe(400);
    });

    // PATH 4: The Happy Path (Line 170-173)
    it('should return 201 and the HTML data on success', async () => {
        req.params = { interviewId: 'fake-id-123' };
        
        InterviewReportModel.findById.mockResolvedValue({
            resumeText: "resume",
            selfDescription: "desc",
            jobDescription: "job"
        });
        
        // Force the AI service to return a beautiful HTML string!
        generateResumeHTML.mockResolvedValue("<div>Perfect Resume</div>");
        
        await generateResumeHtmlController(req, res, next);
        
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: "html created",
            htmlData: "<div>Perfect Resume</div>"
        });
    });

    // PATH 5: The Catch Block (Line 175-177)
    it('should return 500 if an unexpected error occurs', async () => {
        req.params = { interviewId: 'fake-id-123' };
        
        // Force the database to violently crash
        InterviewReportModel.findById.mockRejectedValue(new Error("Database explosion"));
        
        await generateResumeHtmlController(req, res, next);
        
        expect(next).toHaveBeenCalledWith(expect.any(AppError));
        expect(next.mock.calls[0][0].message).toBe("Database explosion");
        expect(next.mock.calls[0][0].statusCode).toBe(500);
    });
});