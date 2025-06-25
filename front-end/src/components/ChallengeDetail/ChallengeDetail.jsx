import { useParams } from "react-router-dom";
import ChallengeHeader from "../ChallengeHeader/ChallengeHeader";
import "./ChallengeDetail.css";

export default function ChallengeDetail({ data }) {
  const { name } = useParams();
  const challenge = data.find((c) => c.name === name);

  if (!challenge || !challenge.creator) {
    return <div>Challenge không tồn tại</div>;
  }

  return (
    <div className="challenge-detail-container">
      <ChallengeHeader
        name={challenge.name}
        difficulty={challenge.difficulty}
        points={challenge.points || 0}
      />

      <div className="challenge-body">
        <div className="challenge-sidebar">
          <h4 className="sidebar-title">NO CONNECTION REQUIRED</h4>
          <ul className="sidebar-actions">
            <li>
              <span className="icon">📁</span>
              <div>
                <strong>Download Files</strong>
                <p>Necessary files to play the challenge.</p>
              </div>
            </li>
            <li>
              <span className="icon">🚩</span>
              <div>
                <strong>Submit Flag</strong>
                <p>Submit a flag to this challenge.</p>
              </div>
            </li>
            <li>
              <span className="icon">📝</span>
              <div>
                <strong>Add To-Do List</strong>
                <p>Add this challenge to your list.</p>
              </div>
            </li>
            <li>
              <span className="icon">⭐</span>
              <div>
                <strong>Review Challenge</strong>
                <p>Rate and send your feedback.</p>
              </div>
            </li>
          </ul>
        </div>


        <div className="challenge-main">
          <p className="description">{challenge.description}</p>
          <div className="info-grid">
            <div className="info-card">
              <p className="info-value">{challenge.rating}</p>
              <p className="info-label">Challenge Rating</p>
            </div>
            <div className="info-card">
              <p className="info-value">{challenge.solves}</p>
              <p className="info-label">User Solves</p>
            </div>
            <div className="info-card">
              <p className="info-value">{challenge.category}</p>
              <p className="info-label">Category</p>
            </div>
            <div className="info-card">
              <p className="info-value">{challenge.releaseDate} Days</p>
              <p className="info-label">Release Date</p>
            </div>
            <div className="info-card creator-card">
              <img
                src={challenge.creator.avatar}
                alt="creator"
                className="creator-avatar"
              />
              <p className="creator-name">{challenge.creator.name}</p>
              <button className="respect-btn">Give Respect</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
