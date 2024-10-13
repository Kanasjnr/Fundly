const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const { generateCookieToken } = require("../utils/generateToken");
const UnconfirmedUser = require("../models/unconfirmedUserModel");
const crypto = require("crypto");
const { sendConfirmationMail } = require("../utils/sendMail");
const passport = require("passport");


const successRedirect = async (req, res) => {
  try {
    const googleProfile = req.user;

    const user = await User.findOne({ email: googleProfile.email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found in the database" });
    }


    const token = generateCookieToken({
      email: user.email,
      id: user._id,
    });

    //   Redirect or send a response as needed
    res.redirect(`http://localhost:5173/auth/google-verify?token=${token}`);
  } catch (error) {
    // Handle errors
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const signUp = async (req, res) => {
  try {
		const { email, password, name } = req.body;

		const existingUser = await User.findOne({ email }).select("-password");
		if (existingUser)
			return res.status(400).json({ error: "User already exists" });

		const hashedPassword = await bcrypt.hash(password, 12);

		const token = crypto.randomBytes(32).toString("hex");

		const newUnconfirmedUser = await UnconfirmedUser.create({
			email,
			password: hashedPassword,
			name,
			token,
			// tokenExpiryDate,
		});

		sendConfirmationMail(newUnconfirmedUser, res);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Something went wrong" });
	}
};

const activateAccount = async (req, res) => {
	try {
		const token = req.params.token;
		console.log(token);

		const unconfirmedUser = await UnconfirmedUser.findOne({ token });
		console.log(unconfirmedUser);

		if (!unconfirmedUser) {
			return res
				.status(400)
				.json({ error: "Invalid activation link or activation link expired" });
		} else {
			const confirmedUser = await User.create({
				email: unconfirmedUser.email,
				password: unconfirmedUser.password,
				name: unconfirmedUser.name,
			});

			await UnconfirmedUser.findByIdAndDelete(unconfirmedUser._id);
			console.log(confirmedUser);

			return res
				.status(200)
				.json({ message: "Account activated successfully", confirmedUser });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Something went wrong" });
	}
};


const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser)
      return res.status(404).json({ error: "User doesn't exist" });

    if (!existingUser.password) {
      return res.status(404).json({
        error: "This user was registered using google Authentication",
      });
    }

    const correctPassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!correctPassword)
      return res.status(400).json({ error: "Invalid credentials" });

    const token = generateCookieToken({
      email: existingUser.email,
      id: existingUser._id,
    });

    existingUser.password = null;
    existingUser.updatedAt = null;
    existingUser.createdAt = null;

    res.status(200).json({ loggedInUser: existingUser, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const signOut = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  signUp,
  signIn,
  signOut,
  activateAccount,
  successRedirect,
};
