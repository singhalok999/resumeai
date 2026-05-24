import React, { useState } from "react";
import { toast } from "react-toastify";
import API from "../api/axios";

function Upload() {

  const [file, setFile] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState(null);

  const [jobs, setJobs] =
    useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {

    if (!file) {
      return toast.error(
        "Please select a PDF file!"
      );
    }

    if (
      file.type !==
      "application/pdf"
    ) {
      return toast.error(
        "Only PDF files are allowed!"
      );
    }

    setLoading(true);

    try {

      const formData =
        new FormData();

      formData.append(
        "resume",
        file
      );

      const { data } =
        await API.post(
          "/resume/upload",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      setResult(data.resume);

      setJobs(
        data.recommendedJobs || []
      );

      toast.success(
        "Resume analyzed successfully! 🎉"
      );

    } catch (error) {

      toast.error(
        error.response?.data
          ?.message ||
          "Upload failed"
      );

    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>

      <div style={styles.box}>

        <h2 style={styles.title}>
          Upload Your Resume 📄
        </h2>

        <p style={styles.sub}>
          Our AI will analyze your
          resume and suggest jobs
        </p>

        <div style={styles.uploadArea}>

          <input
            type="file"
            accept=".pdf"
            onChange={
              handleFileChange
            }
            style={
              styles.fileInput
            }
            id="fileInput"
          />

          <label
            htmlFor="fileInput"
            style={
              styles.fileLabel
            }
          >
            {
              file
                ? `✅ ${file.name}`
                : "📁 Click to choose your PDF resume"
            }
          </label>

        </div>

        <button
          style={styles.btn}
          onClick={handleUpload}
          disabled={loading}
        >

          {
            loading
              ? "⏳ Analyzing..."
              : "🚀 Upload & Analyze"
          }

        </button>

        {
          result && (

            <div style={styles.result}>

              <div
                style={
                  styles.scoreBox
                }
              >

                <h3
                  style={
                    styles.scoreText
                  }
                >
                  ATS Score
                </h3>

                <div
                  style={{
                    ...styles.scoreBadge,

                    backgroundColor:
                      result.score >=
                      80
                        ? "#00b894"
                        : result.score >=
                          60
                        ? "#fdcb6e"
                        : "#e17055",
                  }}
                >
                  {result.score}/100
                </div>

              </div>

              <div
                style={
                  styles.section
                }
              >

                <h4
                  style={
                    styles.sectionTitle
                  }
                >
                  🎯 Skills
                </h4>

                <div
                  style={
                    styles.tags
                  }
                >

                  {
                    result.skills?.map(
                      (
                        skill,
                        i
                      ) => (
                        <span
                          key={i}
                          style={
                            styles.tag
                          }
                        >
                          {skill}
                        </span>
                      )
                    )
                  }

                </div>

              </div>

              <div
                style={
                  styles.section
                }
              >

                <h4
                  style={
                    styles.sectionTitle
                  }
                >
                  💡 AI Tips
                </h4>

                {
                  result.tips?.map(
                    (
                      tip,
                      i
                    ) => (
                      <p
                        key={i}
                        style={
                          styles.tip
                        }
                      >
                        ✦ {tip}
                      </p>
                    )
                  )
                }

              </div>

              {
                result
                  .missingSections
                  ?.length > 0 && (
                  <div
                    style={
                      styles.section
                    }
                  >

                    <h4
                      style={
                        styles.sectionTitle
                      }
                    >
                      ⚠️ Missing
                      Sections
                    </h4>

                    <div
                      style={
                        styles.tags
                      }
                    >

                      {
                        result.missingSections.map(
                          (
                            s,
                            i
                          ) => (
                            <span
                              key={
                                i
                              }
                              style={{
                                ...styles.tag,

                                backgroundColor:
                                  "#e94560",
                              }}
                            >
                              {s}
                            </span>
                          )
                        )
                      }

                    </div>

                  </div>
                )
              }

              {/* Recommended Jobs */}

              <div
                style={
                  styles.jobsSection
                }
              >

                <h3
                  style={
                    styles.sectionTitle
                  }
                >
                  🚀 Recommended
                  Jobs
                </h3>

                {
                  jobs.map(
                    (job) => (

                      <div
                        key={
                          job.job_id
                        }
                        style={
                          styles.jobCard
                        }
                      >

                        <h4
                          style={{
                            color:
                              "white",
                          }}
                        >
                          {
                            job.job_title
                          }
                        </h4>

                        <p
                          style={{
                            color:
                              "#aaa",
                          }}
                        >
                          {
                            job.employer_name
                          }
                        </p>

                        <p
                          style={{
                            color:
                              "#777",
                          }}
                        >
                          {
                            job.job_location
                          }
                        </p>

                        <a
                          href={
                            job.job_apply_link
                          }
                          target="_blank"
                          rel="noreferrer"
                          style={
                            styles.applyBtn
                          }
                        >
                          Apply
                          Now
                        </a>

                      </div>
                    )
                  )
                }

              </div>

            </div>
          )
        }

      </div>

    </div>
  );
}

const styles = {

  container: {
    minHeight: "100vh",
    backgroundColor:
      "#0f0f1a",
    padding: "30px",
    display: "flex",
    justifyContent:
      "center",
  },

  box: {
    backgroundColor:
      "#1a1a2e",
    borderRadius: "12px",
    padding: "40px",
    width: "100%",
    maxWidth: "700px",
  },

  title: {
    color: "white",
    textAlign: "center",
  },

  sub: {
    color: "#aaa",
    textAlign: "center",
    marginBottom: "30px",
  },

  uploadArea: {
    marginBottom: "20px",
  },

  fileInput: {
    display: "none",
  },

  fileLabel: {
    display: "block",
    padding: "20px",
    border:
      "2px dashed #333",
    borderRadius: "8px",
    color: "#aaa",
    textAlign: "center",
    cursor: "pointer",
  },

  btn: {
    width: "100%",
    padding: "12px",
    backgroundColor:
      "#e94560",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  result: {
    marginTop: "30px",
  },

  scoreBox: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
  },

  scoreText: {
    color: "white",
  },

  scoreBadge: {
    padding: "8px 18px",
    borderRadius: "20px",
    color: "white",
    fontWeight: "bold",
  },

  section: {
    marginTop: "20px",
  },

  sectionTitle: {
    color: "#e94560",
    marginBottom: "10px",
  },

  tags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },

  tag: {
    backgroundColor:
      "#16213e",
    color: "#aaa",
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "12px",
  },

  tip: {
    color: "#aaa",
    fontSize: "14px",
  },

  jobsSection: {
    marginTop: "30px",
  },

  jobCard: {
    backgroundColor:
      "#16213e",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "15px",
  },

  applyBtn: {
    display: "inline-block",
    marginTop: "10px",
    backgroundColor:
      "#e94560",
    color: "white",
    padding: "8px 14px",
    borderRadius: "6px",
    textDecoration:
      "none",
  },
};

export default Upload;