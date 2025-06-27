import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ChallengeDetail.css";

const ChallengeDetail = () => {
  const navigate = useNavigate();
  const { name } = useParams(); 
  const [challenge, setChallenge] = useState(null); 
  const [isJoined, setIsJoined] = useState(() => {
    const savedState = localStorage.getItem("isJoined");
    return savedState ? JSON.parse(savedState) : false;
  });
  const [flagValue, setFlagValue] = useState(""); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchChallengeDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        console.log("Fetching challenge with name:", name, "Token:", token); 
        if (!token) {
          throw new Error("No authentication token found. Please log in.");
        }
        const response = await fetch(`http://localhost:5000/api/challenges/${name}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log("Response status:", response.status); 
        if (!response.ok) {
          const errorText = await response.text();
          console.log("Response error:", errorText); 
          if (response.status === 401) {
            localStorage.removeItem("token");
            throw new Error("Session expired. Please log in again.");
          }
          throw new Error(`Failed to fetch challenge: ${errorText || response.statusText}`);
        }
        const data = await response.json();
        console.log("Fetched data:", data); 
        if (data && typeof data === "object" && data.name) {
          setChallenge({
            name: data.name,
            difficulty: data.difficulty,
            points: data.points,
            releaseDate: new Date(data.release_date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
            creator: { name: "FlsMatHack" }, 
            ip_machine: data.ip_machine
          });
        } else {
          throw new Error("Invalid or incomplete challenge data from server");
        }
      } catch (err) {
        console.error("Fetch error:", err.message); 
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChallengeDetail();
  }, [name]); 

  const handleJoin = () => {
    setIsJoined(true);
    localStorage.setItem("isJoined", JSON.stringify(true));
  };

  const handlePause = () => {
    setIsJoined(false);
    setFlagValue("");
    localStorage.setItem("isJoined", JSON.stringify(false));
  };

  const handleFlagChange = (e) => {
    setFlagValue(e.target.value);
  };

  const handleBack = () => {
    navigate("/");
  };

  const challengeData = challenge || {
    name: "Loading...",
    difficulty: "Loading...",
    points: 0,
    releaseDate: "Loading...",
    creator: { name: "Loading..." },
  };

  return (
    <div className="challenge-box">
      {loading && <p>Loading challenge details...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {!loading && !error && (
        <>
          <div className="challenge-header">
            <button className="back-btn" onClick={handleBack}>
              Back
            </button>
            <img src="/logo.png" alt="Machine Icon" className="machine-icon" />
            <div className="machine-info">
              <h2>{challengeData.name}</h2>
              <p>
                Linux · <span className="easy">{challengeData.difficulty}</span>
              </p>
            </div>
            <div className="challenge-meta">
              <p className="points">{challengeData.points} Points</p>
              <p className="stars">★★★★★</p>
              <div className="rating-bar">
                <div className="bar"></div>
              </div>
            </div>
          </div>

          <div className="challenge-tabs">
            {["Play Machine", "Machine Info", "Walkthroughs", "Reviews", "Activity", "Changelog"].map((tab, i) => (
              <button key={i} className={i === 0 ? "active" : ""}>{tab}</button>
            ))}
          </div>

          <div className="challenge-container">
            <div className="challenge-body">
              <div className="header">
                {!isJoined ? (
                  <button className="join-btn" onClick={handleJoin}>
                    Join Machine
                  </button>
                ) : (
                  <div className="joined-section">
                    <div className="target-ip-container">
                      <span className="target-ip">Target IP Address</span>
                      <h3>{challengeData.ip_machine}</h3>
                    </div>
                    <button className="pause-btn" onClick={handlePause}>
                      Pause
                    </button>
                  </div>
                )}
              </div>

              <div className="input-section">
                <input
                  type="text"
                  placeholder="Submit User Flag"
                  disabled={!isJoined}
                  className="flag-input"
                  value={flagValue}
                  onChange={handleFlagChange}
                />
                {isJoined && <button className="submit-btn">Submit</button>}
              </div>
            </div>

            <p className="release">
              <span className="date">Released on {challengeData.releaseDate}</span>
              <span className="creator">Created by {challengeData.creator.name}</span>
              <button className="like-btn">👍</button>
            </p>
            <div className="bloods">
              <div className="blood-box single-line">
                <span>User Blood pwned by</span>
                <img src="https://avatars.githubusercontent.com/u/1?v=4" alt="NLITE" className="blood-avatar" />
                <span className="blood-name">NLITE</span>
                <span className="blood-time">🩸 0H 12M 2S</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChallengeDetail;