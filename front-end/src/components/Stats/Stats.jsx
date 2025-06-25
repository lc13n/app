import "./Stats.css";

export default function SidebarStats({ data }) {
  const fill = data.solved * 100 / data.total; 

  return (
    <div className="sidebar-stats">
      <div className="stat-box">
        <p className="stat-number">{`${data.solved}/${data.total}`}</p>
        <p className="stat-label">FLAGS</p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${fill}%` }}></div>
        </div>
      </div>



      <div className="profile-card">
        <div className="avatar-circle">LC</div>
        <p className="username">{`${data.name}`}</p>
        <p className="rank">
          <strong>{`${data.rank}`}</strong><span>st</span>
        </p>
        <p className="rank-label">TEAM RANK</p>
        <p className="points">
          <strong>{`${data.points}`}</strong><span>pts</span>
        </p>
        <p className="rank-label">TEAM POINTS</p>
        <p className="stat-number">{`${data.solved}/${data.total}`}</p>
        <p className="stat-label">FLAGS</p>
      </div>
    </div>
  );
}
