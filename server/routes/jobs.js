const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { addJob, getJobs, matchJob } = require("../controllers/jobController");

router.post("/", auth, addJob);
router.get("/", auth, getJobs);
router.get("/match/:jobId", auth, matchJob);

module.exports = router;