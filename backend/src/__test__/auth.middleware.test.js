const isLogedIn = require('../middleware/auth.middleware.js');
const jwt = require('jsonwebtoken');
const blackListModel = require('../model/blacklist.model.js');
const AppError = require('../utils/error.utils.js');

// 1. Mock the external dependencies
jest.mock('jsonwebtoken');
jest.mock('../model/blacklist.model.js');

describe('Auth Middleware - isLogedIn', () => {
    let req, res, next;

    beforeEach(() => {
        // Reset our fake request, response, and next function before every test
        req = { cookies: { token: 'fake-jwt-token' } };
        res = {}; 
        next = jest.fn(); // We spy on next() to see what errors get passed into it
        jest.clearAllMocks();
    });

    // PATH 1: The Blacklisted Token (Line 16-18)
    it('should return 401 if the token is blacklisted', async () => {
        // Force the database to find the token in the blacklist!
        blackListModel.findOne.mockResolvedValue({ token: 'fake-jwt-token' });

        await isLogedIn(req, res, next);

        // Assert it triggered the exact AppError on Line 17
        expect(next).toHaveBeenCalledWith(expect.any(AppError));
        expect(next.mock.calls[0][0].message).toBe("Token is blacklisted");
        expect(next.mock.calls[0][0].statusCode).toBe(401);
    });

    // PATH 2: The Falsy Decode (Line 22-24)
    it('should return 401 if the decoded token is falsy', async () => {
        // The token is NOT blacklisted
        blackListModel.findOne.mockResolvedValue(null);
        
        // Force jwt.verify to return null instead of a user payload
        jwt.verify.mockReturnValue(null);

        await isLogedIn(req, res, next);

        // Assert it triggered the exact AppError on Line 23
        expect(next).toHaveBeenCalledWith(expect.any(AppError));
        expect(next.mock.calls[0][0].message).toBe("Token not valid");
        expect(next.mock.calls[0][0].statusCode).toBe(401);
    });

    // PATH 3: The Catch Block Crash (Line 28-30)
    it('should return 500 if an error is thrown during verification', async () => {
        blackListModel.findOne.mockResolvedValue(null);
        
        // Force jwt.verify to throw a violent error (like a bad signature)
        jwt.verify.mockImplementation(() => {
            throw new Error("jwt malformed");
        });

        await isLogedIn(req, res, next);

        // Assert it triggered the catch block on Line 29
        expect(next).toHaveBeenCalledWith(expect.any(AppError));
        expect(next.mock.calls[0][0].message).toBe("jwt malformed");
        expect(next.mock.calls[0][0].statusCode).toBe(500);
    });
});