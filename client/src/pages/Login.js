import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/axios";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const { data } = await API.post(
        "/auth/login",
        form
      );

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      toast.success("Login successful!");

      navigate("/");

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Login failed"
      );

    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>

        <div style={styles.logoArea}>
          <h1 style={styles.logo}>
            ResumeAI 🚀
          </h1>

          <p style={styles.logoSub}>
            AI-Powered Resume Analyzer
          </p>
        </div>

        <h2 style={styles.title}>
          Welcome Back 👋
        </h2>

        <p style={styles.sub}>
          Login to continue
        </p>

        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            required
          />

          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            style={styles.btn}
            disabled={loading}
          >
            {
              loading
                ? "Logging in..."
                : "Login"
            }
          </button>
        </form>

        <p style={styles.link}>
          Don't have an account?{" "}
          <Link to="/register">
            Register here
          </Link>
        </p>

      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f0f1a",
    padding: "20px",
  },

  box: {
    backgroundColor: "#1a1a2e",
    padding: "40px",
    borderRadius: "12px",
    width: "400px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    boxShadow: "0 0 20px rgba(0,0,0,0.4)",
  },

  logoArea: {
    textAlign: "center",
  },

  logo: {
    color: "#e94560",
    margin: 0,
    fontSize: "28px",
  },

  logoSub: {
    color: "#aaa",
    marginTop: "5px",
    fontSize: "13px",
  },

  title: {
    color: "white",
    textAlign: "center",
    margin: 0,
  },

  sub: {
    color: "#aaa",
    textAlign: "center",
    marginTop: "-10px",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #333",
    backgroundColor: "#16213e",
    color: "white",
    fontSize: "14px",
    outline: "none",
  },

  btn: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#e94560",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
  },

  link: {
    color: "#aaa",
    textAlign: "center",
    fontSize: "14px",
  },
};

export default Login;