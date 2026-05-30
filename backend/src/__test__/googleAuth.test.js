const jwt = require("jsonwebtoken");
const  googleCallback  = require('../controllers/googleAuth.controller.js'); // Adjust path if needed!

describe("Google Auth Callback Controller", () => {
    let req, res, next;

    // This runs before EVERY test, resetting our fake objects
    beforeEach(() => {
        req = { user: null };

        // We replace res.redirect and res.cookie with Jest "spies" so we can track them
        res = {
            redirect: jest.fn(),
            cookie: jest.fn()
        };

        next = jest.fn();

        // Inject the environment variables used in your controller
        process.env.FRONTEND_URL = "http://localhost:3000";
        process.env.JWT_SERECT = "test_secret"; // Matching the spelling on line 24!
        process.env.NODE_ENV = "development";
    });

    // 1. THE MISSING USER PATH (Lines 9-14)
    it("should redirect to frontend login with AuthenticationFailed if user is missing", () => {
        req.user = undefined; // Simulate Passport failing to attach the user

        googleCallback(req, res, next);

        // Assert that the function correctly triggered the redirect
        expect(res.redirect).toHaveBeenCalledWith(
            "http://localhost:3000/login?error=AuthenticationFailed"
        );
    });

    // 2. THE HAPPY PATH (Lines 18-37)
    it("should sign a JWT, set a cookie, and redirect to the dashboard", () => {
        // Fake the user object that Passport usually provides
        req.user = {
            _id: "fake_id_123",
            email: "google@example.com",
            authProvider: "google"
        };

        // Hijack jwt.sign to return a fake token instantly so we don't need real secrets
        const signMock = jest
            .spyOn(jwt, "sign")
            .mockReturnValue("fake_jwt_token");

        googleCallback(req, res, next);

        // Assert all three steps happened!
        expect(signMock).toHaveBeenCalled();
        expect(res.cookie).toHaveBeenCalledWith(
            "token",
            "fake_jwt_token",
            expect.any(Object)
        );
        expect(res.redirect).toHaveBeenCalledWith("http://localhost:3000/");

        signMock.mockRestore();
    });

    // 3. THE 500 CATCH BLOCK (Lines 38-42)
    it("should trigger the catch block and redirect with ServerError if an exception occurs", () => {
        req.user = { _id: "fake_id" };

        // Force jwt.sign to violently crash to trigger the catch block
        const errorMock = jest.spyOn(jwt, "sign").mockImplementation(() => {
            throw new Error("Catastrophic JWT Crash!");
        });

        googleCallback(req, res, next);

        // Assert it handled the crash gracefully
        expect(res.redirect).toHaveBeenCalledWith(
            "http://localhost:3000/login?error=ServerError"
        );

        // Assert your next(new AppError(...)) was triggered!
        expect(next).toHaveBeenCalled();

        errorMock.mockRestore();
    });
});
