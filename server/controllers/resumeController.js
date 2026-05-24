const Resume = require("../models/Resume");

const {
  extractTextFromPDF,
} = require("../utils/pdfParser");

const {
  getResumeFeedback,
} = require("../services/aiService");

const {
  searchJobs,
} = require("../services/jobService");

// Upload Resume
exports.uploadResume = async (
  req,
  res
) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        message:
          "Koi file upload nahi hui",
      });
    }

    // PDF se text nikalo
    const extractedText =
      await extractTextFromPDF(
        req.file.buffer
      );

    // AI feedback lo
    const aiFeedback =
      await getResumeFeedback(
        extractedText
      );

    // AI role ke according jobs search karo
    const jobs =
      await searchJobs(
        aiFeedback.role
      );

    // MongoDB me save karo
    const resume =
      await Resume.create({
        userId: req.userId,

        fileName:
          req.file.originalname,

        extractedText,

        score:
          aiFeedback.score,

        tips:
          aiFeedback.tips,

        missingSections:
          aiFeedback.missingSections,

        skills:
          aiFeedback.skills,
      });

    // Final response
    res.status(201).json({
      message:
        "Resume analyze ho gaya!",

      resume: {
        id: resume._id,

        fileName:
          resume.fileName,

        score:
          resume.score,

        tips:
          resume.tips,

        missingSections:
          resume.missingSections,

        skills:
          resume.skills,
      },

      recommendedJobs: jobs,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });

  }
};

// Get all resumes
exports.getResumes = async (
  req,
  res
) => {
  try {

    const resumes =
      await Resume.find({
        userId: req.userId,
      })
        .select("-extractedText")
        .sort({
          createdAt: -1,
        });

    res.json({
      resumes,
    });

  } catch (error) {

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });

  }
};

// Get single resume
exports.getResumeById = async (
  req,
  res
) => {
  try {

    const resume =
      await Resume.findOne({
        _id: req.params.id,

        userId: req.userId,
      });

    if (!resume) {
      return res.status(404).json({
        message:
          "Resume nahi mila",
      });
    }

    res.json({
      resume,
    });

  } catch (error) {

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });

  }
};