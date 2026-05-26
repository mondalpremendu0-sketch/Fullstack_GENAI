import { useState } from "react";
import {useNavigate} from "react-router"
import { useInterview } from '../hooks/useInterviewContext.js'; 
import '../styles/PreviousReports.scss';


const getScoreColor = (score) => {
  if (score >= 90) return "#4ade80"; 
  if (score >= 80) return "#fb923c";  
  if (score >= 70) return "#facc15"; 
  return "#f87171";                  
};

// Utility function to format MongoDB ISO date string
const formatDate = (isoString) => {
  if (!isoString) return "Unknown Date";
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const ScoreRing = ({ score, color }) => {
  const r = 18;
  const circ = 2 * Math.PI * r;
  const safeScore = score || 0;
  const offset = circ - (safeScore / 100) * circ;

  return (
    <svg width="48" height="48" viewBox="0 0 48 48" className="score-ring">
      <circle cx="24" cy="24" r={r} className="score-ring__bg" />
      <circle
        cx="24"
        cy="24"
        r={r}
        className="score-ring__progress"
        stroke={color || "#ffffff"}
        strokeDasharray={circ}
        strokeDashoffset={offset}
      />
      <text x="24" y="28" className="score-ring__text">
        {safeScore}
      </text>
    </svg>
  );
};

const TagPill = ({ icon, label, active }) => (
  <span className={`tag-pill ${active ? "tag-pill--active" : ""}`}>
    {icon} {label}
  </span>
);

const ReportCard = ({ report, expanded, onToggle }) => {
  const scoreColor = getScoreColor(report.matchScore);
  const formattedDate = formatDate(report.createdAt);
  const navigate = useNavigate();
  const handleViewReport = (e) => {
     e.stopPropagation();
     navigate(`/report/${report._id}`)
  }
  
  return (
    <div
      onClick={onToggle}
      className={`report-card ${expanded ? "report-card--expanded" : ""}`}
    >
      <div className="report-card__header">
        <ScoreRing score={report.matchScore} color={scoreColor} />

        <div className="report-card__info">
          <div className="report-card__title" title={report.title}>
            {report.title || "Untitled Role"}
          </div>
          <div className="report-card__meta">
            {report.company || "Independent"} · {formattedDate}
          </div>
        </div>

        <div className="report-card__chevron">⌄</div>
      </div>

      {/* NEW: Wrapper for ultra-smooth Grid 0fr to 1fr transition */}
      <div className="report-card__details-wrapper">
        <div className="report-card__details-inner">
          
          <div className="report-card__details-content">
            <div className="report-card__divider" />

            <div className="report-card__tags">
              <TagPill icon="👁" label="Match Score" active={true} />
              <TagPill
                icon="💡"
                label={`${report.questionsCount || 10} Questions`}
                active={true}
              />
              <TagPill icon="📋" label="Roadmap" active={true} />
            </div>

            <div className="report-card__actions">
              <button
                onClick={handleViewReport}
                className="btn btn--primary"
              >
                View Report →
              </button>
              <button
                onClick={(e) => e.stopPropagation()}
                className="btn btn--icon"
                aria-label="Delete Report"
              >
                🗑
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default function PreviousReports() {
  const { Reports } = useInterview();
  const [expandedId, setExpandedId] = useState(null);



  const toggle = (id) => setExpandedId((prev) => (prev === id ? null : id));

  

  return (
    <div className="reports-section">
      <div className="reports-header">
        <div className="reports-header__title-group">
          <div className="reports-header__icon">🕐</div>
          <span className="reports-header__title">Previous Interview Reports</span>
        </div>

        <span className="reports-header__count">
          {Reports?.length || 0} reports
        </span>
      </div>

      <div className="reports-grid">
        {!Reports || Reports.length === 0 ? (
          <div className="reports-section__empty">No reports found.</div>
        ) : (
          Reports.map((report) => (
            <ReportCard
              key={report._id} 
              report={report}
              expanded={expandedId === report._id}
              onToggle={() => toggle(report._id)}
            />
          ))
        )}
      </div>

      {Reports && Reports.length > 0 && (
        <div className="reports-footer">Tap a report to expand details</div>
      )}
    </div>
  );
}