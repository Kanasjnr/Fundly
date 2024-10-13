const passport = require("passport");

const authenticateGoogle = passport.authenticate('google', { scope: ['profile', 'email'] });


const googleAuthCallback = passport.authenticate("google", {
	failureRedirect: "http://localhost:5173/auth", 
});


module.exports = {authenticateGoogle, googleAuthCallback };
