const nodemailer = require('nodemailer');
const crypto = require('crypto');

// In-memory storage for pending verifications (replace with a database in production)
const pendingVerifications = new Map();
// In-memory storage for verified users (replace with a database in production)
const verifiedUsers = new Set();

class VerificationController {
  static async requestVerification(req, res) {
    const { name } = req.body;
    const document = req.file;

    if (!document) {
      return res.status(400).json({ message: 'No document uploaded.' });
    }

    const verificationId = crypto.randomBytes(16).toString('hex');
    pendingVerifications.set(verificationId, { name, document });

    const approveUrl = `${process.env.BASE_URL}/api/verify/approve/${verificationId}`;
    const rejectUrl = `${process.env.BASE_URL}/api/verify/reject/${verificationId}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: 'New Verification Request',
      html: `
        <p>Name: ${name}</p>
        <p>
          <a href="${approveUrl}">Approve</a> | 
          <a href="${rejectUrl}">Reject</a>
        </p>
      `,
      attachments: [
        {
          filename: document.originalname,
          content: document.buffer,
        },
      ],
    };

    try {
      await transporter.sendMail(mailOptions);
      
      // Simulate immediate verification (remove this in production)
      verifiedUsers.add(name);
      
      res.status(200).json({ 
        message: 'Verification request sent successfully.',
        isVerified: true // Add this for immediate feedback
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to send verification request.' });
    }
  }

  static async approveVerification(req, res) {
    const { id } = req.params;
    const verification = pendingVerifications.get(id);

    if (!verification) {
      return res.status(404).json({ message: 'Verification request not found.' });
    }

    verifiedUsers.add(verification.name);
    pendingVerifications.delete(id);
    res.status(200).json({ message: 'Verification approved successfully.' });
  }

  static async rejectVerification(req, res) {
    const { id } = req.params;
    const verification = pendingVerifications.get(id);

    if (!verification) {
      return res.status(404).json({ message: 'Verification request not found.' });
    }

    pendingVerifications.delete(id);
    res.status(200).json({ message: 'Verification rejected.' });
  }

  static async checkVerificationStatus(req, res) {
    const { name } = req.params;
    const isVerified = verifiedUsers.has(name);
    res.status(200).json({ isVerified });
  }
}

module.exports = { VerificationController };