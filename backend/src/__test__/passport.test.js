const passport = require("passport");
const authModel = require("../model/auth.model.js"); // ⚠️ Adjust this path to your model!

// 1. THE ULTIMATE HIJACK: Mock the Google Library!
// When your code runs `new GoogleStrategy(...)`, this intercepts it and steals the callback function.
let verifyCallback;
jest.mock("passport-google-oauth20", () => ({
    Strategy: class MockGoogleStrategy {
        constructor(options, verify) {
            this.name = "google"; // <--- Add this line! Passport needs to know our name.
            verifyCallback = verify; 
        }
    }
}));

describe("Google OAuth Passport Strategy", () => {
    let doneMock;
    let fakeProfile;

    beforeAll(() => {
        // 2. Require your file to execute it. This forces it to hand us the callback!
        require("../config/passport.js"); // ⚠️ Adjust this path to where your passport code lives!
    });

    beforeEach(() => {
        jest.clearAllMocks();
        doneMock = jest.fn(); // Mock the passport 'done' function

        // Simulate the exact data Google sends back
        fakeProfile = {
            _json: {
                given_name: "Google",
                family_name: "User",
                email: "google@example.com",
                picture: "http://example.com/pic.jpg",
                sub: "google_12345"
            }
        };
    });

    // PATH 1: Existing Google User (Lines 20-25)
    it("should log in an existing Google user directly", async () => {
        const existingGoogleUser = { email: "google@example.com", googleId: "google_12345" };

        // Hijack the DB to return the user on the FIRST search (Line 20)
        const findMock = jest.spyOn(authModel, 'findOne').mockResolvedValue(existingGoogleUser);

        // Run the stolen callback!
        await verifyCallback("accessToken", "refreshToken", fakeProfile, doneMock);

        expect(findMock).toHaveBeenCalledWith({ googleId: "google_12345" });
        expect(doneMock).toHaveBeenCalledWith(null, existingGoogleUser);

        findMock.mockRestore();
    });

    // PATH 2: Linking an Existing Local User (Lines 28-41)
    it("should link a new Google account to an existing local email", async () => {
        const existingLocalUser = {
            email: "google@example.com",
            profilePicture: null,
            save: jest.fn().mockResolvedValue(true) // We must mock the .save() function!
        };

        // Hijack the DB: First search (Line 20) is null, Second search (Line 28) finds the user
        const findMock = jest.spyOn(authModel, 'findOne')
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce(existingLocalUser);

        await verifyCallback("accessToken", "refreshToken", fakeProfile, doneMock);

        // Assert it correctly updated the user object
        expect(existingLocalUser.googleId).toBe("google_12345");
        expect(existingLocalUser.profilePicture).toBe("http://example.com/pic.jpg");
        expect(existingLocalUser.save).toHaveBeenCalled(); // Assert line 39 ran
        expect(doneMock).toHaveBeenCalledWith(null, existingLocalUser);

        findMock.mockRestore();
    });

    // PATH 3: Brand New User (Lines 43-54)
    it("should create a brand new user if they don't exist", async () => {
        // Hijack the DB: Both searches return null!
        const findMock = jest.spyOn(authModel, 'findOne').mockResolvedValue(null);
        
        const newUser = { email: "google@example.com", authProvider: "google" };
        const createMock = jest.spyOn(authModel, 'create').mockResolvedValue(newUser);

        await verifyCallback("accessToken", "refreshToken", fakeProfile, doneMock);

        // Assert it triggered creation with the right fallbacks
        expect(createMock).toHaveBeenCalledWith({
            firstname: "Google",
            lastname: "User",
            email: "google@example.com",
            googleId: "google_12345",
            profilePicture: "http://example.com/pic.jpg",
            authProvider: "google"
        });
        expect(doneMock).toHaveBeenCalledWith(null, newUser);

        findMock.mockRestore();
        createMock.mockRestore();
    });

    // PATH 4: The 500 Catch Block (Lines 55-57)
    it("should trigger the catch block and call done with an error if DB crashes", async () => {
        // Force the database to violently crash
        const dbError = new Error("Database Meltdown!");
        const crashMock = jest.spyOn(authModel, 'findOne').mockRejectedValue(dbError);

        // Mock console.error to keep our terminal clean during the test!
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        await verifyCallback("accessToken", "refreshToken", fakeProfile, doneMock);

        expect(consoleSpy).toHaveBeenCalledWith("Error during Google Strategy:", dbError);
        expect(doneMock).toHaveBeenCalledWith(dbError, null);

        crashMock.mockRestore();
        consoleSpy.mockRestore();
    });
});