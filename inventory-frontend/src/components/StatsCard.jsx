import './StatsCard.css';

const StatsCard = ({ title, value, icon, color }) => {
  return (
    <div className={`stats-card stats-card-${color}`}>
      <div className="stats-content">
        <div className="stats-number">{value}</div>
        <div className="stats-title">{title}</div>
      </div>
      <div className="stats-icon">{icon}</div>
    </div>
  );
};

export default StatsCard;
