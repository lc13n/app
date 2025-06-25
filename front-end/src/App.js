import { useEffect, useState } from "react";
import ChallengeTable from "./components/ChallengeTable/ChallengeTable";
import Header from "./components/Header/Header";
import "./App.css"; 
import SidebarStats from "./components/Stats/Stats";
import ChallengeDetail from "./components/ChallengeDetail/ChallengeDetail";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";



export default function App() {
  const [challenges, setChallenges] = useState([]);
  const teams = {
    id: 223518,
    avatar: "https://s3.eu-central-1.amazonaws.com/htb-ctf-prod-public-storage/teams/4d0d416c-b4db-4487-9279-0d4ab4561a20-avatar.png",
    name: "lc13n",
    rank: 5281,
    points: 2375,
    solved: 3,
    total: 37
  };

  const fakeChallenges = [
  {
    name: "hihi",
    difficulty: "Very Easy",
    category: "Reversing",
    rating: 4.6,
    votes: 60,
    solves: 8612,
    description: "All the coolest ghosts in town are going to a Haunted Houseparty – can you prove you deserve to get in?",
    releaseDate: 222,
    creator: {
      name: "clubby789",
      avatar: "https://avatars.githubusercontent.com/u/9919?v=4",
    },
  },
];
  useEffect(() => {
    const fakeData = [
      {
        name: "hihi",
        difficulty: "Very Easy",
        category: "Reversing",
        rating: 4.6,
        votes: 60,
        solves: 8592,
      },
    ];
    setChallenges(fakeData);
  }, []);

  return (
    <div className="app-container">
      <Header />
      <div className="content">
        <div className="main-content">
          <SidebarStats data={teams}/>
        </div>
        <div className="sidebar">
          <Routes>
            <Route path="/" element={<ChallengeTable data={challenges} />}/>
            <Route 
              path="/challenges/:name"
              element={<ChallengeDetail data={fakeChallenges} />}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}
