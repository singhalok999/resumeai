const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  fileName: { type: String },
  extractedText: { type: String },
  score: { type: Number, default: 0 },
  tips: [{ type: String }],
  missingSections: [{ type: String }],
  skills: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model("Resume", resumeSchema);