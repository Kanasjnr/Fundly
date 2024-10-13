const express = require('express');
const multer = require('multer');
const { VerificationController } = require('../controllers/userController');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post('/request', upload.single('document'), VerificationController.requestVerification);
router.get('/approve/:id', VerificationController.approveVerification);
router.get('/reject/:id', VerificationController.rejectVerification);
router.get('/status/:name', VerificationController.checkVerificationStatus);

module.exports = router;