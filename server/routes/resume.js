const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("../middleware/authMiddleware");
const { uploadResume, getResumes, getResumeById } = require("../controllers/resumeController");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", auth, upload.single("resume"), uploadResume);
router.get("/", auth, getResumes);
router.get("/:id", auth, getResumeById);

module.exports = router;