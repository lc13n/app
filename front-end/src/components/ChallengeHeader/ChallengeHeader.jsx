import "./ChallengeHeader.css";

export default function ChallengeHeader({ name, difficulty, points }) {
  const difficultyBars = [30, 14, 11, 3, 2, 1, 1, 1, 1, 1]; 

  return (
    <div className="challenge-header-bar">

      <div className="left-section">
        <div className="back-button">←</div>
        <div className="separator" />
        <div className="icon-title">
          <div className="challenge-icon">📊</div>
          <div className="title-block">
            <div className="challenge-title">{name}</div>
            <div className="challenge-difficulty">{difficulty.toUpperCase()}</div>
          </div>
        </div>
      </div>


      <div className="middle-section">
        <div className="difficulty-bars">
          {difficultyBars.map((height, index) => (
            <div
              key={index}
              className={`bar ${
                height > 10 ? "green" : height > 2 ? "orange" : "red"
              }`}
              style={{ height: `${height}px` }}
            ></div>
          ))}
        </div>
        <div className="difficulty-label">DIFFICULTY RATING</div>
      </div>


      <div className="right-section">
        <div className="points-icon">🔷</div>
        <div className="points-info">
          <span className="points-value">{points}</span>
          <span className="points-label">POINTS</span>
        </div>
      </div>
    </div>
  );
}
