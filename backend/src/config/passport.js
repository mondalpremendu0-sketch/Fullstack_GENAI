const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const GoogleUser = require('../model/googleAuth.model.js'); 




passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Extract the data from Google's profile
    const { name, email, sub } = profile._json;
    
    // 2. Check if the user already exists in your database
    let user = await GoogleUser.findOne({ googleId: sub });
    
    // 3. If they don't exist, create a new record
    if (!user) {
      // Generate a base username by removing spaces and making it lowercase
      const baseUsername = name ? name.replace(/\s+/g, '').toLowerCase() : 'user';
      // Append a random 4-digit number to guarantee uniqueness
      const uniqueUsername = `${baseUsername}${Math.floor(1000 + Math.random() * 9000)}`;

      user = await GoogleUser.create({
        googleId: sub,
        email: email,
        username: uniqueUsername
      });
    }
    
    // 4. Pass the Mongoose user document to the next step
    return done(null, user);

  } catch (error) {
    console.error("Error during Google Strategy:", error);
    return done(error, null);
  }
}));