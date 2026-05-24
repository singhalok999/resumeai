const Job = require("../models/Job");
const Resume = require("../models/Resume");
const { getJobMatchScore } = require("../services/aiService");

// Add new job
exports.addJob = async (req, res) => {
  try {
    const { title, company, description, requiredSkills } = req.body;

    const job = await Job.create({
      title,
      company,
      description,
      requiredSkills,
      postedBy: req.userId,
    });

    res.status(201).json({ message: "Job add ho gaya!", job });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all jobs
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json({ jobs });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Match resume with job
exports.matchJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: "Job nahi mili" });
    }

    // User ka latest resume lo
    const resume = await Resume.findOne({ userId: req.userId })
      .sort({ createdAt: -1 });

    if (!resume) {
      return res.status(404).json({ message: "Pehle resume upload karo" });
    }

    // AI se match score lo
    const matchResult = await getJobMatchScore(
      resume.extractedText,
      job.description
    );

    res.json({
      message: "Match result ready!",
      job: { title: job.title, company: job.company },
      matchResult,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};