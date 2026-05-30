const jwt = require("jsonwebtoken");
const AppError = require('../utils/error.utils.js')
// This function runs AFTER Passport has successfully authenticated the user
const googleCallback = (req, res,next) => {
    try {
        // Passport attaches the user document (from your database) to `req.user`
        const user = req.user;

        if (!user) {
            // If something went wrong, redirect to your frontend's login page with an error
            return res.redirect(
                `${process.env.FRONTEND_URL}/login?error=AuthenticationFailed`
            );
        }

        // 1. Generate the JWT (JSON Web Token)
        // We only put non-sensitive data in the payload (like ID and role)
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                authProvider: user.authProvider
            },
            process.env.JWT_SERECT,
            { expiresIn: "7d" } // Token expires in 7 days
        );

        // 2. Set the JWT in a secure HttpOnly cookie
        res.cookie("token", token, {
            httpOnly: true, // JavaScript on the frontend CANNOT read this (prevents XSS)
            secure: process.env.NODE_ENV === "production", // Must be true in production (HTTPS only)
            sameSite: "Strict", // Protects against Cross-Site Request Forgery (CSRF)
            maxAge: 5 * 24 * 60 * 60 * 1000 // 5 days in milliseconds
        });

        // 3. Redirect the user back to your frontend application dashboard
        res.redirect(`${process.env.FRONTEND_URL}/`);
    } catch (error) {
        res.redirect(`${process.env.FRONTEND_URL}/login?error=ServerError`);
        return(next(new AppError("google authentication faild",401)))
    }
};

module.exports = googleCallback;

