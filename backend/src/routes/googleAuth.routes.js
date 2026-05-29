const express = require('express');
const passport = require('passport');
const authController = require('../controllers/auth.controller');

const GoogleRouter = express.Router();

// ==========================================
// 1. Trigger Google Login
// Frontend should use an <a href="/api/auth/google"> tag to hit this route
// ==========================================
GoogleRouter.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account' // Forces Google to show the account selector every time
  })
);

// ==========================================
// 2. Google Callback URL
// Google sends the user here after they approve the login
// ==========================================
GoogleRouter.get('/google/callback', 
  // First, Passport intercepts the request to exchange the code for the profile
  passport.authenticate('google', { 
    session: false, // We are using JWTs, not Express sessions
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=GoogleAuthFailed` 
  }),
  // Second, if successful, it passes control to your controller
  googleCallback
);

module.exports = GoogleRouter;