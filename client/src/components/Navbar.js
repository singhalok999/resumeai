import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <Link to={user.role === "recruiter" ? "/jobs" : "/"} style={styles.brand}>
        ResumeAI 🚀
      </Link>
      <div style={styles.links}>
        {user.role === "recruiter" ? (
          <>
            <Link to="/jobs" style={styles.link}>Job Listings</Link>
          </>
        ) : (
          <>
            <Link to="/" style={styles.link}>Dashboard</Link>
            <Link to="/upload" style={styles.link}>Upload Resume</Link>
            <Link to="/jobs" style={styles.link}>Job Matches</Link>
          </>
        )}
        <div style={styles.userInfo}>
          <span style={styles.roleBadge}>
            {user.role === "recruiter" ? "👔 Recruiter" : "👨‍💻 Candidate"}
          </span>
          <button onClick={logout} style={styles.btn}>Logout</button>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 30px", backgroundColor:"#1a1a2e", borderBottom:"1px solid #16213e" },
  brand: { color:"#e94560", fontWeight:"bold", fontSize:"22px", textDecoration:"none" },
  links: { display:"flex", alignItems:"center", gap:"20px" },
  link: { color:"white", textDecoration:"none", fontSize:"14px" },
  userInfo: { display:"flex", alignItems:"center", gap:"12px" },
  roleBadge: { backgroundColor:"#16213e", color:"#aaa", padding:"5px 12px", borderRadius:"20px", fontSize:"12px" },
  btn: { backgroundColor:"#e94560", color:"white", border:"none", padding:"8px 16px", borderRadius:"5px", cursor:"pointer", fontSize:"14px" }
};

export default Navbar;