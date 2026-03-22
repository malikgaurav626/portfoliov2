import { memo } from "react";
import PropTypes from "prop-types";

const RECRUITER_PANEL_CONFIG = [
  {
    title: "RECRUITER MODE",
    subtitle: "Sakura Intro Feed",
    summary:
      "Gaurav - Software Engineer 1 at MAQ Software, ex-ASE at MAQ, ex-Web Developer Intern at Pixel Bridges, and IIIT Sonepat graduate focused on frontend and product engineering.",
    status: ["New Delhi / Noida NCR", "B.Tech Computer Engineering", "Reply in 24-48h"],
    facts: [
      { label: "Current", value: "Software Engineer 1 @ MAQ Software (Full-time Jul 2025 - Present)" },
      { label: "Experience", value: "Associate Software Engineer @ MAQ (Jan 2025 - Jun 2025), Web Developer Intern @ Pixel Bridges (Feb 2024 - Jan 2025)" },
      { label: "Location", value: "Noida, India | malikgaurav626@gmail.com" },
    ],
    notes: [
      "Professional introduction with a stronger portfolio-first presentation.",
      "Good starting point for understanding background before deeper channels.",
      "Designed to move recruiters naturally into skills, work, and contact.",
    ],
  },
  {
    title: "ARRAKIS DOSSIER",
    subtitle: "Skills Broadcast",
    summary:
      "A technical snapshot covering frontend depth, software engineering fundamentals, QA/security workflows, and production delivery patterns across internship, freelance, and full-time work.",
    status: ["Frontend + Web3", "Security + QA", "AI / System Design"],
    facts: [
      { label: "Programming", value: "C, C++, C#, Python, Java, JavaScript, JSX, HTML5, CSS, React, Redux, Next.js" },
      { label: "Security / Tooling", value: "Snyk, Fiddler, Datadog, web app pen-test resolution, REST APIs, end-to-end testing" },
      { label: "Creative / Systems", value: "System design, Lucidchart, AI agents, OpenCV, Neural Networks, Adobe PS/Premiere/Audition" },
    ],
    notes: [
      "Best for recruiters screening for implementation depth and UI instincts.",
      "Shows the mix of maintainable engineering and cinematic presentation.",
      "Connects well to product teams, studios, and web-focused roles.",
    ],
  },
  {
    title: "WINTER ARCHIVE",
    subtitle: "Project Casebook",
    summary:
      "A project-focused scan across production websites, interactive 3D experiences, Web3 dashboards, and applied ML/game builds with measurable implementation depth.",
    status: ["30+ Client Websites", "Web3 + 3D Products", "ML + Game Builds"],
    facts: [
      { label: "Live Projects", value: "Forex Dominant, Zyrithra, VortyX Finance, Vexaris, Geode, Cosmic Route" },
      { label: "Delivery Record", value: "30+ websites delivered (Pixel Bridges + freelance)" },
      { label: "Extended Portfolio", value: "Neko Noir, Exo Archives, Game Ether, NeoNotes, Flux Player, Travel Advisor, Maze Generator" },
    ],
    notes: [
      "The strongest projects are framed as case-study material, not gallery filler.",
      "Good channel for interviewers who want to ask implementation questions.",
      "Balances polish, structure, and practical frontend thinking.",
    ],
  },
  {
    title: "COMMS TERMINAL",
    subtitle: "Space Contact Console",
    summary:
      "A direct hiring channel for role-fit conversations, collaboration opportunities, and fast project/recruiter follow-up.",
    status: ["Noida / Remote", "IST Timezone", "Email Preferred"],
    facts: [
      { label: "Role Target", value: "Frontend Engineer / Web Developer" },
      { label: "Contact Route", value: "malikgaurav626@gmail.com" },
      { label: "Profiles", value: "LinkedIn + GitHub + portfolio links available on request" },
    ],
    notes: [
      "Best final channel for recruiters ready to move from review to outreach.",
      "Pairs well with resume, LinkedIn, and GitHub actions.",
      "Built to reduce friction at the end of the portfolio journey.",
    ],
  },
];

const RECRUITER_ACTIONS = [
  {
    label: "Email Me",
    href: "mailto:malikgaurav626@gmail.com",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/malikgaurav626/",
  },
  {
    label: "GitHub",
    href: "https://github.com/malikgaurav626",
  },
];

const SIGNAL_LEVELS = ["92%", "81%", "87%"];

export function getRecruiterPanelConfig(channel = 0) {
  return RECRUITER_PANEL_CONFIG[channel] || RECRUITER_PANEL_CONFIG[0];
}

export function RecruiterPanelIcon() {
  return (
    <svg
      width="28"
      height="18"
      viewBox="0 0 28 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-hidden="true"
    >
      <path
        d="M1 9.25h7.5M19.5 9.25H27M8.5 5.25h11M8.5 13.25h11"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="square"
      />
      <rect x="10.5" y="1" width="7" height="16" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <path d="M13.3 5.5h1.4v1.4h-1.4zM13.3 11.1h1.4v1.4h-1.4z" fill="currentColor" />
    </svg>
  );
}

export const RecruiterPanel = memo(function RecruiterPanel({ channel = 0, compact = false }) {
  const config = getRecruiterPanelConfig(channel);

  return (
    <div
      className={`recruiter-panel recruiter-panel-ch-${channel} ${
        compact ? "recruiter-panel-compact" : ""
      }`}
    >
      <div className="recruiter-panel-shell">
        <div className="recruiter-panel-chrome">
          <div className="recruiter-panel-leds">
            <span />
            <span />
            <span />
          </div>
          <div className="recruiter-panel-readout">{config.subtitle}</div>
          <div className="recruiter-panel-code">SYNC // CH-{channel + 1}</div>
        </div>

        <div className="recruiter-panel-hero">
          <div className="recruiter-panel-radar">
            <div className="recruiter-panel-radar-grid"></div>
            <div className="recruiter-panel-radar-sweep"></div>
            <span className="recruiter-panel-radar-blip recruiter-panel-radar-blip-a"></span>
            <span className="recruiter-panel-radar-blip recruiter-panel-radar-blip-b"></span>
            <span className="recruiter-panel-radar-blip recruiter-panel-radar-blip-c"></span>
          </div>

          <div className="recruiter-panel-summary-wrap">
            <div className="recruiter-panel-summary">{config.summary}</div>
            <div className="recruiter-panel-status">
              {config.status.map((item) => (
                <span key={`${config.title}-${item}`}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="recruiter-panel-grid">
        {config.facts.map((fact, index) => (
          <article key={`${config.title}-${fact.label}`} className="recruiter-panel-card">
            <div className="recruiter-panel-card-head">
              <div className="recruiter-panel-label">{fact.label}</div>
              <div className="recruiter-panel-level">{SIGNAL_LEVELS[index] || "80%"}</div>
            </div>
            <div className="recruiter-panel-signalbar">
              <span style={{ width: SIGNAL_LEVELS[index] || "80%" }} />
            </div>
            <div className="recruiter-panel-value">{fact.value}</div>
          </article>
        ))}
      </div>


      <div className="recruiter-panel-actions">
        {RECRUITER_ACTIONS.map((action) => (
          <a
            key={`${config.title}-${action.label}`}
            className="recruiter-panel-action"
            href={action.href}
            target={action.href.startsWith("mailto:") ? undefined : "_blank"}
            rel={action.href.startsWith("mailto:") ? undefined : "noreferrer"}
          >
            <span className="recruiter-panel-action-text">{action.label}</span>
            <span className="recruiter-panel-action-glow"></span>
          </a>
        ))}
      </div>
    </div>
  );
});

RecruiterPanel.propTypes = {
  channel: PropTypes.number,
  compact: PropTypes.bool,
};
