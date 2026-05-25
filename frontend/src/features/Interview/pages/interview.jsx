import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {useInterview} from '../hooks/useInterviewContext.js'
import Loadingui from '../components/Loading.jsx'
import '../styles/interview.scss';

// ─── Sample data (replace with API response) ──────────────────────────────────
/*const REPORT = {
  matchScore: 93,
  technicalQuestions: [
    {
      question: "Can you explain the main differences between controlled and uncontrolled components in React, and when would you choose one over the other?",
      intention: "To assess understanding of fundamental React concepts, state management, and practical application in forms within a MERN context.",
      answer: "Ideal answer defines both, explains how state is managed (React vs. DOM), provides use cases for each, and discusses advantages like easier validation with controlled vs. simpler third-party integration with uncontrolled."
    },
    {
      question: "How do you handle error management and input validation effectively across your API endpoints to ensure robustness and security?",
      intention: "To evaluate backend development practices — robust error handling, security, and maintainable API design for production-ready applications.",
      answer: "Discuss using middleware for global error handling, validation libraries like Joi or express-validator, and sending appropriate HTTP status codes with clear error messages."
    },
    {
      question: "Could you describe the architecture of how you integrated Socket.io with your MERN stack? How did you handle authentication and message persistence?",
      intention: "To delve into project experience — assessing understanding of real-time communication, secure auth integration, and MongoDB data modeling.",
      answer: "Explain server-side Socket.io setup, client connection, passing JWT tokens during handshake, and persisting chat messages in MongoDB with a schema including sender, receiver, content, and timestamp."
    },
    {
      question: "When designing your MongoDB database, how do you decide between embedding documents and using references?",
      intention: "To test database design skills, understanding of MongoDB's document model, and ability to make informed decisions for performance and scalability.",
      answer: "Explain embedding pros (performance, single query) vs. referencing (flexibility, consistency), with a concrete example from a project based on access patterns."
    },
    {
      question: "Describe your debugging process for a full-stack MERN application when the issue could be on either frontend or backend.",
      intention: "To assess problem-solving methodology, debugging skills, and familiarity with developer tools — essential for an intern role.",
      answer: "Describe checking browser console/network tab, using React DevTools, inspecting backend logs, VS Code debugger, Postman for API testing, and systematic isolation of the problem."
    }
  ],
  behavioralQuestions: [
    {
      question: "Tell me about a time you faced a significant technical challenge and how you approached solving it. What did you learn?",
      intention: "To evaluate problem-solving skills, resilience, and ability to learn from difficulties — aligning with the job's focus on growth mindset.",
      answer: "Describe a specific problem, the steps taken to diagnose and resolve it (research, debugging, asking for help), and key takeaways or skills acquired."
    },
    {
      question: "Collaboration is important in this role. Describe a project where you worked closely with others. What was your role and how did you contribute?",
      intention: "To assess teamwork and communication skills, ability to work collaboratively, and understanding of individual contribution to a shared goal.",
      answer: "Detail a group project, define specific responsibilities, explain communication methods, conflict resolution if any, and how the team achieved its objectives."
    },
    {
      question: "Give an example of a time you had to learn a new technology rapidly for a project. How did you approach that learning process?",
      intention: "To gauge the ability to learn quickly and adapt to new technologies — a critical skill for an intern in a dynamic environment.",
      answer: "Identify a specific technology, explain why it needed to be learned quickly, outline the learning strategy, and demonstrate successful application."
    },
    {
      question: "How do you prioritize your work when you have multiple deadlines or competing demands?",
      intention: "To understand time management and organizational skills — crucial for success in an internship with varied responsibilities.",
      answer: "Describe a prioritization method (urgent/important matrix, impact assessment), mention tools used, and provide an example of managing competing demands."
    },
    {
      question: "What excites you about this role, and how do you see it contributing to your long-term goal of becoming a skilled software engineer?",
      intention: "To assess motivation, alignment with the company's offerings, and how the candidate connects this opportunity to their career aspirations.",
      answer: "Articulate specific aspects of the job that resonate (real-world projects, mentorship, scalable apps), linking them to long-term goals of building impactful products."
    }
  ],
  skillGaps: [
    { skill: "TypeScript", severity: "medium" },
    { skill: "State Management (Redux, Zustand)", severity: "medium" },
    { skill: "Cloud Deployment (Vercel, Render)", severity: "medium" },
    { skill: "Advanced Performance Optimization", severity: "low" }
  ],
  preparationPlan: [
    {
      day: 1, focus: "React & Frontend Fundamentals",
      tasks: [
        "Review React Hooks (useState, useEffect, useContext, useRef, useMemo, useCallback)",
        "Practice building reusable atomic components with clear props and state",
        "Understand the virtual DOM and reconciliation for performance implications",
        "Reinforce responsive design principles with Tailwind CSS"
      ]
    },
    {
      day: 2, focus: "Backend API Design & Authentication",
      tasks: [
        "Review Express.js middleware, routing, and error handling best practices",
        "Deep dive into JWT for authentication and authorization flow",
        "Implement role-based access control in a sample Express API",
        "Practice secure coding: input sanitization, rate limiting"
      ]
    },
    {
      day: 3, focus: "MongoDB & Database Operations",
      tasks: [
        "Review MongoDB CRUD and Mongoose schema design best practices",
        "Learn MongoDB indexing strategies for query optimization",
        "Practice aggregation pipelines for complex data retrieval",
        "Understand embedding vs. referencing and when to use each"
      ]
    },
    {
      day: 4, focus: "TypeScript & State Management",
      tasks: [
        "Complete a TypeScript fundamentals tutorial (types, interfaces, enums)",
        "Refactor a React component to use TypeScript for props and state",
        "Explore Redux Toolkit or Zustand — install, basic store setup, actions",
        "Understand trade-offs of state management libraries in large apps"
      ]
    },
    {
      day: 5, focus: "Deployment & Interview Prep",
      tasks: [
        "Learn deploying MERN apps to Vercel (frontend) and Render (backend)",
        "Prepare to articulate architecture of both your projects",
        "Practice explaining code decisions, data models, and API designs",
        "Review common MERN interview questions and behavioral aspects"
      ]
    }
  ]
};*/

// ─── Nav sections ─────────────────────────────────────────────────────────────
const NAV = [
  { id: "overview",   label: "Overview",             icon: "📊" },
  { id: "technical",  label: "Technical Questions",  icon: "⚙️",  count: 5 },
  { id: "behavioral", label: "Behavioral Questions", icon: "🧠",  count: 5 },
  { id: "roadmap",    label: "Road Map",              icon: "🗺️",  count: 5 },
  { id: "skillgaps",  label: "Skill Gaps",            icon: "⚡",  count: 5},
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function scoreLabel(s) {
  if (s >= 85) return "Excellent Match";
  if (s >= 70) return "Good Match";
  if (s >= 55) return "Fair Match";
  return "Needs Work";
}
function scoreVariant(s) {
  if (s >= 85) return "high";
  if (s >= 70) return "medium";
  return "low";
}

// ─── Animated question card ───────────────────────────────────────────────────
function QCard({ q, index }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      className="ir__q-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="ir__q-header" onClick={() => setOpen(o => !o)}>
        <span className="ir__q-num">Q{String(index + 1).padStart(2, "0")}</span>
        <p className="ir__q-text">{q.question}</p>
        <svg
          className={`ir__q-chevron${open ? " open" : ""}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="ir__q-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="ir__q-inner">
              <div className="ir__q-block ir__q-block--intention">
                <div className="ir__q-block-label">🎯 Interviewer's Intention</div>
                <p className="ir__q-block-text">{q.intention}</p>
              </div>
              <div className="ir__q-block ir__q-block--answer">
                <div className="ir__q-block-label">✅ Ideal Answer</div>
                <p className="ir__q-block-text">{q.answer}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}


// Helper function to get ring colors based on score
function getRingColors(score) {
  if (score >= 85) return { c1: "#34d399", c2: "#10b981" }; // Green (Excellent Match)
  if (score >= 70) return { c1: "#f5e92bfb", c2: "#f5e92bfb" }; // Blue (Good Match)
  if (score >= 55) return { c1: "#fbbf24", c2: "#f59e0b" }; // Orange (Fair Match)
  return { c1: "#f87171", c2: "#ef4444" };                   // Red (Needs Work)
}

function ScoreRing({ score }) {
  const r = 40;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const colors = getRingColors(score);

  return (
    <div className="ir__score-ring">
      <svg viewBox="0 0 100 100">
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            {/* The colors now update dynamically based on the score */}
            <stop offset="0%" stopColor={colors.c1} />
            <stop offset="100%" stopColor={colors.c2} />
          </linearGradient>
        </defs>
        <circle className="ring-bg" cx="50" cy="50" r={r} />
        <motion.circle
          className="ring-fill"
          cx="50" cy="50" r={r}
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        />
      </svg>
      <div className="ring-label">
        <motion.span
          className="ring-number"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {score}
        </motion.span>
        <span className="ring-unit">/ 100</span>
      </div>
    </div>
  );
}

// ─── Main Component----
export default function Interview() {
  const {loading,Report} = useInterview();
  if(loading){
    return(<Loadingui />);
  }
  const report = Report;
  
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sectionRefs = useRef({});

  // Scroll spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) setActiveSection(e.target.dataset.section);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    Object.values(sectionRefs.current).forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
    setSidebarOpen(false);
  };

  const sv = scoreVariant(report.matchScore);

  return (
    <div className="ir">
      {/* ── Top Bar ── */}
      <header className="ir__topbar">
        <div className="ir__topbar-left">
          <button className="ir__back" onClick={() => history.back()}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <span className="ir__title">Interview <span>Report</span></span>
        </div>

        <div className="ir__topbar-right">
          <div className="ir__score-badge">
            Match: <span className="score-num">{report.matchScore}%</span>
          </div>
          <button className="ir__menu-btn" onClick={() => setSidebarOpen(o => !o)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6"  x2="21" y2="6"  />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </header>

      <div className="ir__body">
        {/* ── Overlay (mobile) ── */}
        <div
          className={`ir__overlay${sidebarOpen ? " open" : ""}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* ── Left Sidebar ── */}
        <aside className={`ir__sidebar${sidebarOpen ? " open" : ""}`}>
          <div className="ir__sidebar-section">
            <div className="ir__sidebar-label">Navigation</div>
            {NAV.map(item => (
              <button
                key={item.id}
                className={`ir__nav-item${activeSection === item.id ? " active" : ""}`}
                onClick={() => scrollTo(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
                {item.count && <span className="nav-count">{item.count}</span>}
              </button>
            ))}
          </div>

          <div className="ir__sidebar-divider" />

          <div className="ir__sidebar-section">
            <div className="ir__sidebar-label">Quick Stats</div>
            <div style={{ padding: "8px 10px" }}>
              {[
                ["Match Score", `${report.matchScore}%`],
                ["Tech Qs", report.technicalQuestions.length],
                ["Behavioral Qs", report.behavioralQuestions.length],
                ["Prep Days", report.preparationPlan.length],
              ].map(([k, v]) => (
                <div key={k} style={{
                  display: "flex", justifyContent: "space-between",
                  fontSize: 12, padding: "5px 0",
                  borderBottom: "1px solid var(--border)",
                  color: "var(--text-2)"
                }}>
                  <span>{k}</span>
                  <span style={{ fontFamily: "var(--font-mono)", color: "var(--accent-2)", fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Main ── */}
        <main className="ir__main">

          {/* Overview */}
          <section
            className="ir__section"
            data-section="overview"
            ref={el => sectionRefs.current.overview = el}
          >
            <div className="ir__score-hero">
              <ScoreRing score={report.matchScore} />
              <div className="ir__score-info">
                <h3>{scoreLabel(report.matchScore)}</h3>
                <p>
                  Your profile matches this job description well. Focus on the
                  skill gaps and preparation plan below to maximize your chances.
                </p>
                <span className={`ir__score-tag ir__score-tag--${sv}`}>
                  {sv === "high" ? "🟢" : sv === "medium" ? "🟡" : "🔴"}
                  {" "}{scoreLabel(report.matchScore)}
                </span>
              </div>
            </div>
          </section>

          {/* Technical Questions */}
          <section
            className="ir__section"
            data-section="technical"
            ref={el => sectionRefs.current.technical = el}
          >
            <div className="ir__section-head">
              <div className="ir__section-icon" style={{ background: "rgba(108,99,255,0.15)", border: "1px solid rgba(108,99,255,0.2)" }}>⚙️</div>
              <h2 className="ir__section-title">Technical Questions</h2>
              <span className="ir__section-count">{report.technicalQuestions.length}</span>
            </div>
            <div className="ir__q-list">
              {report.technicalQuestions.map((q, i) => (
                <QCard key={i} q={q} index={i} />
              ))}
            </div>
          </section>

          {/* Behavioral Questions */}
          <section
            className="ir__section"
            data-section="behavioral"
            ref={el => sectionRefs.current.behavioral = el}
          >
            <div className="ir__section-head">
              <div className="ir__section-icon" style={{ background: "rgba(45,212,191,0.12)", border: "1px solid rgba(45,212,191,0.2)" }}>🧠</div>
              <h2 className="ir__section-title">Behavioral Questions</h2>
              <span className="ir__section-count">{report.behavioralQuestions.length}</span>
            </div>
            <div className="ir__q-list">
              {report.behavioralQuestions.map((q, i) => (
                <QCard key={i} q={q} index={i} />
              ))}
            </div>
          </section>

          {/* Road Map */}
          <section
            className="ir__section"
            data-section="roadmap"
            ref={el => sectionRefs.current.roadmap = el}
          >
            <div className="ir__section-head">
              <div className="ir__section-icon" style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.2)" }}>🗺️</div>
              <h2 className="ir__section-title">Preparation Road Map</h2>
              <span className="ir__section-count">{report.preparationPlan.length} days</span>
            </div>
            <div className="ir__roadmap">
              {report.preparationPlan.map((day, i) => (
                <motion.div
                  key={day.day}
                  className="ir__day-card"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="ir__day-marker">
                    <div className="ir__day-dot">{day.day}</div>
                  </div>
                  <div className="ir__day-content">
                    <div className="ir__day-focus">{day.focus}</div>
                    <div className="ir__day-tasks">
                      {day.tasks.map((t, ti) => (
                        <div key={ti} className="ir__day-task">
                          <span className="task-bullet" />
                          {t}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Skill Gaps — shown inline on smaller screens */}
          <section
            className="ir__section ir__mobile-gaps"
            data-section="skillgaps"
            ref={el => sectionRefs.current.skillgaps = el}
          >
            <div className="ir__section-head">
              <div className="ir__section-icon" style={{ background: "rgba(251,113,133,0.12)", border: "1px solid rgba(251,113,133,0.2)" }}>⚡</div>
              <h2 className="ir__section-title">Skill Gaps</h2>
              <span className="ir__section-count">{report.skillGaps.length}</span>
            </div>
            <div className="ir__gaps">
              {report.skillGaps.map((g, i) => (
                <motion.div
                  key={i}
                  className="ir__gap-item"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.08 }}
                >
                  <span className={`ir__gap-dot ir__gap-dot--${g.severity}`} />
                  <span className="ir__gap-name">{g.skill}</span>
                  <span className={`ir__gap-badge ir__gap-badge--${g.severity}`}>{g.severity}</span>
                </motion.div>
              ))}
            </div>
          </section>

        </main>

        {/* ── Right Panel (desktop only) ── */}
        <aside className="ir__right">
          <div>
            <div className="ir__right-heading">Skill Gaps</div>
            <div className="ir__gap-tags">
              {report.skillGaps.map((g, i) => (
                <motion.span
                  key={i}
                  className={`ir__gap-tag ir__gap-tag--${g.severity}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.07 }}
                >
                  {g.severity === "high" ? "🔴" : g.severity === "medium" ? "🟡" : "🟢"}
                  {g.skill}
                </motion.span>
              ))}
            </div>
          </div>

          <div>
            <div className="ir__right-heading">Progress</div>
            {[
              { label: "Technical", val: report.technicalQuestions.length, max: 10, color: "var(--accent)" },
              { label: "Behavioral", val: report.behavioralQuestions.length, max: 10, color: "var(--teal)" },
              { label: "Prep Days", val: report.preparationPlan.length, max: 7, color: "var(--gold)" },
            ].map(({ label, val, max, color }) => (
              <div key={label} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-3)", marginBottom: 5 }}>
                  <span>{label}</span>
                  <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-2)" }}>{val}/{max}</span>
                </div>
                <div style={{ height: 4, background: "var(--surface-3)", borderRadius: 4, overflow: "hidden" }}>
                  <motion.div
                    style={{ height: "100%", background: color, borderRadius: 4 }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((val / max) * 100, 100)}%` }}
                    transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div>
            <div className="ir__right-heading">Score Breakdown</div>
            <div style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: 12, padding: "14px 16px"
            }}>
              {[
                ["Match Score", `${report.matchScore}%`, "var(--accent-2)"],
                ["Questions",  `${report.technicalQuestions.length + report.behavioralQuestions.length}`, "var(--teal)"],
                ["Gaps Found", `${report.skillGaps.length}`, "var(--gold)"],
                ["Prep Days",  `${report.preparationPlan.length}`, "var(--rose)"],
              ].map(([k, v, c]) => (
                <div key={k} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "7px 0", borderBottom: "1px solid var(--border)",
                  fontSize: 12, color: "var(--text-2)"
                }}>
                  <span>{k}</span>
                  <span style={{ fontFamily: "var(--font-mono)", color: c, fontWeight: 600, fontSize: 13 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
