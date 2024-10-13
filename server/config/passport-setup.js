const passport = require('passport');
const User = require('../models/userModel');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const initializePassport = (passport) => {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:5173/auth/google/callback', 
    scope: ['profile', 'email'],
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Find or create user based on their email
      const existingUser = await User.findOne({ email: profile.emails[0].value });
  
      if (existingUser) {
        // User found, update any necessary information
        existingUser.googleId = profile.id;
        existingUser.name = profile.displayName;
        existingUser.avatar = existingUser.avatar || profile.photos[0].value;
        await existingUser.save();
  
        return done(null, existingUser);
      } else {
        // User not found, create a new user
        const newUser = await User.create({
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          avatar: profile.photos[0].value,
        });
  
        return done(null, newUser);
      }
    } catch (error) {
      return done(error, null);
    }
}));
}

module.exports = initializePassport;