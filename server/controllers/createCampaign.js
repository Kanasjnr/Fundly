const Campaign = require("../models/campaignModel");

// Create a new campaign
const createCampaign = async (req, res) => {
    try {
        const { owner, title, description, target, deadline, image, video, pdf } = req.body;

        // Create a new campaign instance
        const newCampaign = new Campaign({
            owner,
            title,
            description,
            target,
            deadline,
            image,
            video,
            pdf
        });

        // Save the campaign to the database
        const savedCampaign = await newCampaign.save();

        // Send a success response
        res.status(201).json({
            message: 'Campaign created successfully!',
            campaign: savedCampaign
        });
    } catch (error) {
        // Handle errors
        res.status(500).json({
            message: 'An error occurred while creating the campaign',
            error: error.message
        });
    }
};

module.exports = {
    createCampaign
};
