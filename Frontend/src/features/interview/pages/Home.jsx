import React, { useState, useRef } from "react";
import "../style/home.scss";
import { useInterview } from "../hooks/useInterview.js";
import { useNavigate } from "react-router";
import { useAuth } from "../../auth/hooks/useAuth.js";
import logo from "../../../assets/logo.png"

const formatFileSize = (sizeInBytes) => {
  if (!sizeInBytes) {
    return "0 KB";
  }

  if (sizeInBytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(sizeInBytes / 1024))} KB`;
  }

  return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
};

const Home = () => {
  const { loading, generateReport, reports } = useInterview();
  const { handleLogout } = useAuth();
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [error, setError] = useState("");
  const resumeInputRef = useRef();

  const navigate = useNavigate();

  const handleGenerateReport = async () => {
    setError("");

    if (!jobDescription.trim()) {
      setError("Please add a job description.");
      return;
    }

    if (!resumeFile && !selfDescription.trim()) {
      setError("Upload a PDF resume or add a self-description to continue.");
      return;
    }

    try {
      const data = await generateReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });

      if (!data?._id) {
        setError("Unable to generate the interview report right now.");
        return;
      }

      navigate(`/interview/${data._id}`);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Unable to generate the interview report right now.";
      setError(message);
    }
  };

  if (loading) {
    return (
      <main className="loading-screen">
        <h1>Loading your interview plan...</h1>
      </main>
    );
  }

  return (
    <div className="home-page">
      <div className="home-layout">
        <aside className="home-sidebar">
          <div className="home-sidebar__content">
            <div className="home-sidebar__intro">
              {/* <p className="home-sidebar__eyebrow"></p> */}
              <h2>Recent Interview Plans</h2>
            </div>

            {reports.length > 0 ? (
              <ul className="home-sidebar__reports">
                {reports.map((report) => (
                  <li
                    key={report._id}
                    className="home-sidebar__report"
                    onClick={() => navigate(`/interview/${report._id}`)}
                  >
                    <h3>{report.title || "Untitled Position"}</h3>
                    <p>{new Date(report.createdAt).toLocaleDateString()}</p>
                    <span
                      className={`home-sidebar__score ${report.matchScore >= 80 ? "score--high" : report.matchScore >= 60 ? "score--mid" : "score--low"}`}
                    >
                      Match Score: {report.matchScore}%
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="home-sidebar__empty">
                <p>Your generated interview plans will appear here.</p>
              </div>
            )}
          </div>

          <button
            onClick={async () => {
              await handleLogout();
              navigate("/login");
            }}
            className="home-sidebar__logout"
          >
            Logout
          </button>
        </aside>

        <section className="home-main">
          <div className="interview-card">
            <header className="page-header">
              <div className="brand">
                <img src={logo} alt="CareerPilot AI Logo" className="brand-logo" />
              </div>

              <h3 className="page-title">
                Your Personalized Interview Roadmap
              </h3>

              {/* <p className="page-description">
                Let our AI analyze the job requirements and your unique profile
                to build a winning strategy.
              </p> */}
            </header>

            <div className="interview-card__body">
              <div className="panel panel--left">
                <div className="panel__header">
                  <span className="panel__icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                  </span>
                  <h2>Target Job Description</h2>
                  <span className="badge badge--required">Required</span>
                </div>
                <textarea
                  onChange={(e) => {
                    setJobDescription(e.target.value);
                    setError("");
                  }}
                  className="panel__textarea"
                  placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
                  maxLength={5000}
                />
                <div className="char-counter">
                  {jobDescription.length} / 5000 
                </div>
              </div>

              <div className="panel-divider" />

              <div className="panel panel--right">
                <div className="panel__header">
                  <span className="panel__icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  <h2>Your Profile</h2>
                </div>

                <div className="upload-section">
                  <label className="section-label">
                    Upload Resume
                    <span className="badge badge--best">Best Results</span>
                  </label>
                  <label
                    className={`dropzone ${resumeFile ? "dropzone--uploaded" : ""}`}
                    htmlFor="resume"
                  >
                    <span className="dropzone__icon">
                      {resumeFile ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="26"
                          height="26"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <path d="M14 2v6h6" />
                          <path d="m9 15 2 2 4-4" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="16 16 12 12 8 16" />
                          <line x1="12" y1="12" x2="12" y2="21" />
                          <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                        </svg>
                      )}
                    </span>
                    <p className="dropzone__title">
                      {resumeFile
                        ? "Resume uploaded successfully"
                        : "Click to upload Resume"}
                    </p>
                    {resumeFile ? (
                      <>
                        <p className="dropzone__filename">{resumeFile.name}</p>
                        <p className="dropzone__subtitle">
                          {formatFileSize(resumeFile.size)} - Click to replace
                          this file
                        </p>
                      </>
                    ) : (
                      <p className="dropzone__subtitle">PDF only (Max 3MB)</p>
                    )}
                    <input
                      ref={resumeInputRef}
                      hidden
                      type="file"
                      id="resume"
                      name="resume"
                      accept=".pdf"
                      onChange={(e) => {
                        setResumeFile(e.target.files?.[0] ?? null);
                        setError("");
                      }}
                    />
                  </label>
                </div>

                <div className="or-divider">
                  <span>OR</span>
                </div>

                <div className="self-description">
                  <label className="section-label" htmlFor="selfDescription">
                    Quick Self-Description
                  </label>
                  <textarea
                    onChange={(e) => {
                      setSelfDescription(e.target.value);
                      setError("");
                    }}
                    id="selfDescription"
                    name="selfDescription"
                    className="panel__textarea panel__textarea--short"
                    placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                  />
                </div>

                <div className="info-box">
                  <span className="info-box__icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line
                        x1="12"
                        y1="8"
                        x2="12"
                        y2="12"
                        stroke="#1a1f27"
                        strokeWidth="2"
                      />
                      <line
                        x1="12"
                        y1="16"
                        x2="12.01"
                        y2="16"
                        stroke="#1a1f27"
                        strokeWidth="2"
                      />
                    </svg>
                  </span>
                  <p>
                    Either a <strong>Resume</strong> or a{" "}
                    <strong>Self Description</strong> is required to generate a
                    personalized plan.
                  </p>
                </div>
                {error && <div className="form-error">{error}</div>}
              </div>
            </div>

            <div className="interview-card__footer">
              <span className="footer-info">
                AI-Powered Strategy Generation &bull; Approx 30s
              </span>
              <button onClick={handleGenerateReport} className="generate-btn">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z" />
                </svg>
                Generate My Interview Strategy
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
