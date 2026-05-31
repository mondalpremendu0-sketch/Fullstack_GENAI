//require('dotenv').config();
const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const authModel = require("../model/auth.model.js");

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/api/googleAuth/google/callback"
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Extract the data from Google's profile payload
                const { given_name, family_name, email, picture, sub } =
                    profile._json;

                // 1. Check if a user with this exact Google ID already exists
                let user = await authModel.findOne({ googleId: sub });

                if (user) {
                    // User found, proceed to log them in
                    return done(null, user);
                }

                // 2. EDGE CASE PROTECTION: Check if they previously signed up with Email/Password
                user = await authModel.findOne({ email: email });

                if (user) {
                    // The user exists as a 'local' user. We will link their new Google ID to their existing account.
                    user.googleId = sub;

                    // Optionally, grab their Google picture if they didn't upload one locally
                    if (!user.profilePicture && picture) {
                        user.profilePicture = picture;
                    }

                    await user.save();
                    return done(null, user);
                }

                // 3. If neither exists, create a brand new Google user
                const newUser = await authModel.create({
                    firstname: given_name || "Google", // Fallback in case Google omits the first name
                    lastname: family_name || "User", // Fallback in case Google omits the last name
                    email: email,
                    googleId: sub,
                    profilePicture: picture,
                    authProvider: "google" // This is the magic string that bypasses your password requirement!
                });

                // Pass the newly created user to the next step
                return done(null, newUser);
            } catch (error) {
                console.error("Error during Google Strategy:", error);
                return done(error, null);
            }
        }
    )
);
