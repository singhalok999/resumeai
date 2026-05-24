import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/axios";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post("/auth/register", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Account created successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <div style={styles.logoArea}>
          <h1 style={styles.logo}>ResumeAI 🚀</h1>
          <p style={styles.logoSub}>AI-Powered Resume Analyzer & Job Matcher</p>
        </div>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.sub}>Get AI-powered resume feedback instantly</p>
        <input style={styles.input} type="text" name="name" placeholder="Full Name" onChange={handleChange} />
        <input style={styles.input} type="email" name="email" placeholder="Email Address" onChange={handleChange} />
        <input style={styles.input} type="password" name="password" placeholder="Password" onChange={handleChange} />
        <button style={styles.btn} onClick={handleSubmit} disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </button>
        <p style={styles.link}>Already have an account? <Link to="/login">Login here</Link></p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight:"100vh", display:"flex", justifyContent:"center", alignItems:"center", backgroundColor:"#0f0f1a", padding:"20px" },
  box: { backgroundColor:"#1a1a2e", padding:"40px", borderRadius:"12px", width:"420px", display:"flex", flexDirection:"column", gap:"15px" },
  logoArea: { textAlign:"center", marginBottom:"5px" },
  logo: { color:"#e94560", margin:0, fontSize:"24px" },
  logoSub: { color:"#aaa", margin:"5px 0 0 0", fontSize:"12px" },
  title: { color:"white", textAlign:"center", margin:0 },
  sub: { color:"#aaa", textAlign:"center", margin:0 },
  input: { padding:"12px", borderRadius:"8px", border:"1px solid #333", backgroundColor:"#16213e", color:"white", fontSize:"14px" },
  btn: { padding:"12px", backgroundColor:"#e94560", color:"white", border:"none", borderRadius:"8px", fontSize:"16px", cursor:"pointer" },
  link: { color:"#aaa", textAlign:"center" }
};

export default Register;