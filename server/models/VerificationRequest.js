// models/VerificationRequest.js

const mongoose = require('mongoose');

const VerificationRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  document: { type: Buffer, required: true }, // Store document as a buffer
  token: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now, expires: '1h' }, // Expires after 1 hour
});

const VerificationRequest = mongoose.model('VerificationRequest', VerificationRequestSchema);

module.exports = { VerificationRequest };
