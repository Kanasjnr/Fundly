const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    // username: { type: String, unique: true },
    avatar: String,
    isVerified: { type: Boolean, default: false },
    googleId: String,
  },
  {
    timestamps: true,
  }
);

// Check if the model is already registered
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
