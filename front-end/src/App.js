import { useEffect, useState } from "react";
import ChallengeTable from "./components/ChallengeTable/ChallengeTable";
import Header from "./components/Header/Header";
import "./App.css";
import SidebarStats from "./components/Stats/Stats";
import Login from "./components/Login/Login";
import ChallengeDetail from "./components/ChallengeDetail/ChallengeDetail";
import { Routes, Route } from "react-router-dom";

export default function App() {
  const [challenges, setChallenges] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("token")); 
  const [loading, setLoading] = useState(false); 
  const [initialLoading, setInitialLoading] = useState(true); 
  const [error, setError] = useState(null);
  const teams = {
    id: 223518,
    avatar: "https://s3.eu-central-1.amazonaws.com/htb-ctf-prod-public-storage/teams/4d0d416c-b4db-4487-9279-0d4ab4561a20-avatar.png",
    name: "lc13n",
    rank: 5281,
    points: 2375,
    solved: 3,
    total: 37,
  };

  useEffect(() => {
    const initializeApp = async () => {
      setInitialLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        console.log("Token from localStorage:", token); 
        if (!token) {
          setIsLoggedIn(false);
          return; 
        }
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/challenges", {
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
            setIsLoggedIn(false);
            throw new Error("Session expired or invalid token. Please log in again.");
          }
          throw new Error(`Failed to fetch challenges: ${errorText || response.statusText}`);
        }
        const data = await response.json();
        console.log("Fetched data:", data); 
        if (Array.isArray(data)) {
          setChallenges(data);
        } else {
          throw new Error("Invalid data format from server");
        }
      } catch (err) {
        console.error("Fetch error:", err.message); 
        setError(err.message);
      } finally {
        setLoading(false);
        setInitialLoading(false); 
      }
    };

    initializeApp();
  }, []); 

  const handleLogin = () => {
    setIsLoggedIn(true); 
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    setIsLoggedIn(false); 
    setChallenges([]); 
    setError(null); 
  };

  return (
    <div className="app-container">
      {initialLoading ? (
        <p>Loading application...</p> 
      ) : isLoggedIn ? (
        <>
          <Header onLogout={handleLogout} /> 
          <div className="content">
            <div className="main-content">
              <SidebarStats data={teams} />
            </div>
            {loading && <p>Loading challenges...</p>}
              {error && <p style={{ color: "red" }}>Error: {error}</p>}
              {!loading && !error && challenges.length > 0 && (
                <div className="sidebar">
                  <Routes>
                    <Route path="/" element={<ChallengeTable data={challenges} />} />
                    <Route
                      path="/challenges/:name"
                      element={<ChallengeDetail data={challenges.find(chal => chal.name === window.location.pathname.split('/').pop())} />}
                    />
                  </Routes>
                </div>
              )}
              {!loading && !error && challenges.length === 0 && <p>No challenges available.</p>}
          </div>
        </>
      ) : (
        <Login onLogin={handleLogin} /> 
      )}
    </div>
  );
}