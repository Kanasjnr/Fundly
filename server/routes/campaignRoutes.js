const express = require('express');
const router = express.Router();
const { createCampaign } = require('../controllers/createCampaign');

// Route to create a new campaign
router.post('/create', createCampaign);

module.exports = router;
