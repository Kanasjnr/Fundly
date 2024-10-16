const express = require("express");
const passport = require("passport");
const {
	signUp,
	signIn,
	signOut,
	activateAccount,
	successRedirect,
	
} = require("../controllers/authController");
const { googleAuthCallback, authenticateGoogle } = require("../middleware/passportMiddleware");

const router = express.Router();

router.get(
	"/googleauth",
	authenticateGoogle
);

router.get("/google/callback", googleAuthCallback);
router.get("/googleauth/callback", googleAuthCallback, successRedirect);
router.post("/signup", signUp);
router.get("/activate-account/:token", activateAccount);
router.post("/signin", signIn);
router.post("/logout", signOut);

module.exports = router;