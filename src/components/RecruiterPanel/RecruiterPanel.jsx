const RECRUITER_PANEL_CONFIG = [
  {
    title: "RECRUITER MODE",
    subtitle: "Sakura Intro Feed",
    summary:
      "Fast read for recruiters landing on the home channel. This scene is the softest entry point into the portfolio, with the strongest signals surfaced first.",
    status: ["Open to Web Dev Roles", "Based in India", "Reply in 24-48h"],
    facts: [
      { label: "Current", value: "Software Engineer 1 @ MAQ Software" },
      { label: "Strength", value: "Frontend systems with polished UI execution" },
      { label: "Best Fit", value: "Web developer and frontend-focused roles" },
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
      "A channel tuned for technical positioning. It frames core strengths, delivery style, and the kind of frontend work that feels strongest in interviews and portfolio reviews.",
    status: ["Frontend Systems", "Interactive UI", "3D-Ready"],
    facts: [
      { label: "Core Stack", value: "React, JavaScript, Vite, CSS, HTML" },
      { label: "Interactive Layer", value: "Three.js and React Three Fiber work" },
      { label: "Delivery Style", value: "Visually sharp, practical, and iterative" },
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
      "A colder, project-led scan of work quality. This panel frames the kind of builds you can walk a hiring team through: interactive portfolio work, product surfaces, and polished web delivery.",
    status: ["Case Studies", "Product Web", "Frontend Craft"],
    facts: [
      { label: "Project Type", value: "Portfolios, landing pages, dashboards, microsites" },
      { label: "Review Angle", value: "Role clarity, stack choices, execution quality" },
      { label: "Hiring Signal", value: "Useful for portfolio and practical build evaluation" },
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
      "A direct route for outreach. This lane is optimized for hiring conversations, role fit, and fast contact rather than passive browsing.",
    status: ["Hiring Signal Live", "IST Timezone", "Email Preferred"],
    facts: [
      { label: "Role Target", value: "Frontend Engineer / Web Developer" },
      { label: "Contact Route", value: "Email or LinkedIn for fastest response" },
      { label: "Opportunity Fit", value: "Product web, interactive UI, frontend builds" },
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

export function RecruiterPanel({ channel = 0, compact = false }) {
  const config = getRecruiterPanelConfig(channel);
  const signalLevels = ["92%", "81%", "87%"];

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
              <div className="recruiter-panel-level">{signalLevels[index] || "80%"}</div>
            </div>
            <div className="recruiter-panel-signalbar">
              <span style={{ width: signalLevels[index] || "80%" }} />
            </div>
            <div className="recruiter-panel-value">{fact.value}</div>
          </article>
        ))}
      </div>

      <div className="recruiter-panel-notes">
        {config.notes.map((note, index) => (
          <div key={`${config.title}-${note}`} className="recruiter-panel-note">
            <span className="recruiter-panel-note-index">0{index + 1}</span>
            <span>{note}</span>
          </div>
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
}
