import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/axios";

function Dashboard() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const { data } = await API.get("/resume");
      setResumes(data.resumes);
    } catch (error) {
      toast.error("Failed to load resumes");
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Welcome back, {user.name}! 👋</h1>
          <p style={styles.sub}>Track your resume performance and job matches</p>
        </div>
        <button style={styles.btn} onClick={() => navigate("/upload")}>
          + Upload Resume
        </button>
      </div>

      {/* Stats Bar */}
      <div style={styles.statsBar}>
        <div style={styles.statCard}>
          <h2 style={styles.statNum}>{resumes.length}</h2>
          <p style={styles.statLabel}>Resumes Analyzed</p>
        </div>
        <div style={styles.statCard}>
          <h2 style={styles.statNum}>
            {resumes.length > 0 ? Math.round(resumes.reduce((a, r) => a + r.score, 0) / resumes.length) : 0}
          </h2>
          <p style={styles.statLabel}>Average ATS Score</p>
        </div>
        <div style={styles.statCard}>
          <h2 style={styles.statNum}>
            {resumes.length > 0 ? Math.max(...resumes.map(r => r.score)) : 0}
          </h2>
          <p style={styles.statLabel}>Best Score</p>
        </div>
      </div>

      <h2 style={styles.sectionHeader}>Resume History</h2>

      {loading ? (
        <p style={styles.msg}>Loading...</p>
      ) : resumes.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>📄</div>
          <h3 style={{color:"white", marginBottom:"10px"}}>No resumes analyzed yet</h3>
          <p style={{color:"#aaa", marginBottom:"20px"}}>Upload your resume and get instant AI-powered feedback</p>
          <button style={styles.btn} onClick={() => navigate("/upload")}>Upload Your Resume</button>
        </div>
      ) : (
        <div style={styles.grid}>
          {resumes.map((resume) => (
            <div key={resume._id} style={styles.card}>
              <div style={styles.cardTop}>
                <h3 style={styles.fileName}>📄 {resume.fileName}</h3>
                <div style={{
                  ...styles.score,
                  backgroundColor: resume.score >= 80 ? "#00b894" : resume.score >= 60 ? "#fdcb6e" : "#e17055"
                }}>
                  {resume.score}/100
                </div>
              </div>

              <div style={styles.section}>
                <h4 style={styles.sectionTitle}>🎯 Detected Skills</h4>
                <div style={styles.tags}>
                  {resume.skills?.map((skill, i) => (
                    <span key={i} style={styles.tag}>{skill}</span>
                  ))}
                </div>
              </div>

              <div style={styles.section}>
                <h4 style={styles.sectionTitle}>💡 AI Improvement Tips</h4>
                {resume.tips?.slice(0, 3).map((tip, i) => (
                  <p key={i} style={styles.tip}>• {tip}</p>
                ))}
              </div>

              {resume.missingSections?.length > 0 && (
                <div style={styles.section}>
                  <h4 style={styles.sectionTitle}>⚠️ Missing Sections</h4>
                  <div style={styles.tags}>
                    {resume.missingSections.map((s, i) => (
                      <span key={i} style={{...styles.tag, backgroundColor:"#e94560"}}>{s}</span>
                    ))}
                  </div>
                </div>
              )}

              <div style={styles.cardFooter}>
                <p style={styles.date}>
                  🗓 {new Date(resume.createdAt).toLocaleDateString("en-US", { year:"numeric", month:"short", day:"numeric" })}
                </p>
                <button style={styles.matchBtn} onClick={() => navigate("/jobs")}>
                  Find Job Matches →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { minHeight:"100vh", backgroundColor:"#0f0f1a", padding:"30px" },
  header: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"30px" },
  title: { color:"white", margin:"0 0 5px 0" },
  sub: { color:"#aaa", margin:0, fontSize:"14px" },
  btn: { backgroundColor:"#e94560", color:"white", border:"none", padding:"10px 20px", borderRadius:"8px", cursor:"pointer", fontSize:"14px", whiteSpace:"nowrap" },
  statsBar: { display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:"15px", marginBottom:"30px" },
  statCard: { backgroundColor:"#1a1a2e", borderRadius:"12px", padding:"20px", textAlign:"center", border:"1px solid #16213e" },
  statNum: { color:"#e94560", margin:"0 0 5px 0", fontSize:"32px" },
  statLabel: { color:"#aaa", margin:0, fontSize:"13px" },
  sectionHeader: { color:"white", marginBottom:"20px" },
  msg: { color:"#aaa", textAlign:"center" },
  empty: { textAlign:"center", marginTop:"80px" },
  emptyIcon: { fontSize:"60px", marginBottom:"15px" },
  grid: { display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(350px, 1fr))", gap:"20px" },
  card: { backgroundColor:"#1a1a2e", borderRadius:"12px", padding:"20px", border:"1px solid #16213e" },
  cardTop: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"15px" },
  fileName: { color:"white", margin:0, fontSize:"14px" },
  score: { padding:"6px 14px", borderRadius:"20px", color:"white", fontWeight:"bold", fontSize:"16px" },
  section: { marginBottom:"12px" },
  sectionTitle: { color:"#e94560", margin:"0 0 8px 0", fontSize:"13px" },
  tags: { display:"flex", flexWrap:"wrap", gap:"6px" },
  tag: { backgroundColor:"#16213e", color:"#aaa", padding:"4px 10px", borderRadius:"20px", fontSize:"12px" },
  tip: { color:"#aaa", margin:"3px 0", fontSize:"13px" },
  cardFooter: { display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:"15px", borderTop:"1px solid #16213e", paddingTop:"12px" },
  date: { color:"#555", fontSize:"12px", margin:0 },
  matchBtn: { backgroundColor:"transparent", color:"#e94560", border:"none", cursor:"pointer", fontSize:"13px" }
};

export default Dashboard;