const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    target: { type: Number, required: true },
    deadline: { type: Date, required: true },
    amountCollected: { type: Number, default: 0 },
    image: { type: String },
    video: { type: String },
    pdf: { type: String }
});

const Campaign = mongoose.model('Campaign', campaignSchema);

module.exports = Campaign;
