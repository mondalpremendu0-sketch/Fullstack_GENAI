const rateLimit = require('express-rate-limit');

// 1. Strict Limiter for Auth Routes (Login/Register)
// Prevents brute-force password guessing attacks
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 10 requests per window
    message: { 
        error: "Too many attempts from this IP, please try again after 15 minutes." 
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// 2. Generous Limiter for General API Routes
// Prevents standard spam/scraping on your other endpoints
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: { 
        error: "API rate limit exceeded. Please slow down your requests." 
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Export all limiters so you can pick and choose which ones to use in your routes
module.exports = {
    authLimiter,
    apiLimiter
};