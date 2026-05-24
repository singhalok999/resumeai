import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import API from "../api/axios";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchResults, setMatchResults] = useState({});
  const [matchLoading, setMatchLoading] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", company: "", description: "", requiredSkills: "" });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data } = await API.get("/jobs");
      setJobs(data.jobs);
    } catch (error) {
      toast.error("Failed to load jobs");
    }
    setLoading(false);
  };

  const handleAddJob = async () => {
    if (!form.title || !form.company || !form.description) {
      return toast.error("Please fill all required fields!");
    }
    try {
      const jobData = {
        ...form,
        requiredSkills: form.requiredSkills.split(",").map(s => s.trim()),
      };
      await API.post("/jobs", jobData);
      toast.success("Job posted successfully!");
      setShowForm(false);
      setForm({ title: "", company: "", description: "", requiredSkills: "" });
      fetchJobs();
    } catch (error) {
      toast.error("Failed to add job");
    }
  };

  const handleMatch = async (jobId) => {
    setMatchLoading({ ...matchLoading, [jobId]: true });
    try {
      const { data } = await API.get(`/jobs/match/${jobId}`);
      setMatchResults({ ...matchResults, [jobId]: data.matchResult });
      toast.success("Match analysis complete! 🎯");
    } catch (error) {
      toast.error(error.response?.data?.message || "Match failed");
    }
    setMatchLoading({ ...matchLoading, [jobId]: false });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Job Listings 💼</h1>
        <button style={styles.btn} onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Post a Job"}
        </button>
      </div>

      {showForm && (
        <div style={styles.form}>
          <h3 style={{ color: "white", marginTop: 0 }}>Post a New Job</h3>
          <input style={styles.input} placeholder="Job Title" value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input style={styles.input} placeholder="Company Name" value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })} />
          <textarea style={{ ...styles.input, height: "100px", resize: "vertical" }}
            placeholder="Job Description" value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input style={styles.input} placeholder="Required Skills (comma separated: React, Node.js, MongoDB)"
            value={form.requiredSkills}
            onChange={(e) => setForm({ ...form, requiredSkills: e.target.value })} />
          <button style={styles.btn} onClick={handleAddJob}>Post Job</button>
        </div>
      )}

      {loading ? (
        <p style={styles.msg}>Loading...</p>
      ) : jobs.length === 0 ? (
        <div style={styles.empty}>
          <h3 style={{ color: "white" }}>No jobs posted yet!</h3>
          <p style={{ color: "#aaa" }}>Click "+ Post a Job" to add job listings</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {jobs.map((job) => (
            <div key={job._id} style={styles.card}>
              <h3 style={styles.jobTitle}>{job.title}</h3>
              <p style={styles.company}>🏢 {job.company}</p>
              <p style={styles.desc}>{job.description.substring(0, 150)}...</p>

              {job.requiredSkills?.length > 0 && (
                <div style={styles.tags}>
                  {job.requiredSkills.map((skill, i) => (
                    <span key={i} style={styles.tag}>{skill}</span>
                  ))}
                </div>
              )}

              <button style={styles.matchBtn} onClick={() => handleMatch(job._id)}
                disabled={matchLoading[job._id]}>
                {matchLoading[job._id] ? "⏳ Analyzing..." : "🎯 Match My Resume"}
              </button>

              {matchResults[job._id] && (
                <div style={styles.matchResult}>
                  <div style={styles.matchTop}>
                    <span style={{ color: "white" }}>Match Score</span>
                    <span style={{
                      ...styles.matchScore,
                      backgroundColor: matchResults[job._id].match_score >= 70 ? "#00b894" :
                        matchResults[job._id].match_score >= 50 ? "#fdcb6e" : "#e17055"
                    }}>
                      {matchResults[job._id].match_score}%
                    </span>
                  </div>
                  <p style={{ color: "#aaa", fontSize: "13px" }}>{matchResults[job._id].verdict}</p>

                  {matchResults[job._id].matched_skills?.length > 0 && (
                    <div>
                      <p style={{ color: "#00b894", fontSize: "12px", margin: "5px 0" }}>✅ Matched Skills:</p>
                      <div style={styles.tags}>
                        {matchResults[job._id].matched_skills.map((s, i) => (
                          <span key={i} style={{ ...styles.tag, backgroundColor: "#00b89433" }}>{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {matchResults[job._id].missing_skills?.length > 0 && (
                    <div style={{ marginTop: "8px" }}>
                      <p style={{ color: "#e94560", fontSize: "12px", margin: "5px 0" }}>❌ Missing Skills:</p>
                      <div style={styles.tags}>
                        {matchResults[job._id].missing_skills.map((s, i) => (
                          <span key={i} style={{ ...styles.tag, backgroundColor: "#e9456033" }}>{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", backgroundColor: "#0f0f1a", padding: "30px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" },
  title: { color: "white", margin: 0 },
  btn: { backgroundColor: "#e94560", color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer" },
  form: { backgroundColor: "#1a1a2e", padding: "25px", borderRadius: "12px", marginBottom: "25px", display: "flex", flexDirection: "column", gap: "12px" },
  input: { padding: "12px", borderRadius: "8px", border: "1px solid #333", backgroundColor: "#16213e", color: "white", fontSize: "14px" },
  msg: { color: "#aaa", textAlign: "center" },
  empty: { textAlign: "center", marginTop: "100px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "20px" },
  card: { backgroundColor: "#1a1a2e", borderRadius: "12px", padding: "20px", border: "1px solid #16213e" },
  jobTitle: { color: "white", margin: "0 0 5px 0" },
  company: { color: "#e94560", margin: "0 0 10px 0", fontSize: "14px" },
  desc: { color: "#aaa", fontSize: "13px", margin: "0 0 12px 0" },
  tags: { display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" },
  tag: { backgroundColor: "#16213e", color: "#aaa", padding: "4px 10px", borderRadius: "20px", fontSize: "12px" },
  matchBtn: { width: "100%", padding: "10px", backgroundColor: "#16213e", color: "#e94560", border: "1px solid #e94560", borderRadius: "8px", cursor: "pointer", fontSize: "14px" },
  matchResult: { marginTop: "15px", backgroundColor: "#16213e", padding: "15px", borderRadius: "8px" },
  matchTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" },
  matchScore: { padding: "4px 12px", borderRadius: "20px", color: "white", fontWeight: "bold" },
};

export default Jobs;