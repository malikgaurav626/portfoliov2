import { useEffect, useRef } from "react";

export const TV_SCREEN_HTML_WIDTH = 620;
export const TV_SCREEN_HTML_HEIGHT = 440;

function stopTvInteraction(event) {
  event.stopPropagation();
}

function TVPageRoot({ children, className, interactive }) {
  const pageRef = useRef(null);

  useEffect(() => {
    if (!interactive || !pageRef.current) return;

    const frame = window.requestAnimationFrame(() => {
      pageRef.current?.focus({ preventScroll: true });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [interactive]);

  function handlePointerDownCapture(event) {
    stopTvInteraction(event);
    if (!interactive) return;
    pageRef.current?.focus({ preventScroll: true });
  }

  function handleWheelCapture(event) {
    stopTvInteraction(event);

    if (!interactive || !pageRef.current) return;

    pageRef.current.scrollTop += event.deltaY;
    pageRef.current.scrollLeft += event.deltaX;
    event.preventDefault();
  }

  function handleTouchStartCapture(event) {
    stopTvInteraction(event);
    if (!interactive) return;
    pageRef.current?.focus({ preventScroll: true });
  }

  return (
    <div
      ref={pageRef}
      className={className}
      tabIndex={interactive ? 0 : -1}
      onPointerDownCapture={handlePointerDownCapture}
      onClickCapture={stopTvInteraction}
      onWheelCapture={handleWheelCapture}
      onTouchStartCapture={handleTouchStartCapture}
    >
      {children}
    </div>
  );
}

function ChannelOnePage({ interactive }) {
  return (
    <TVPageRoot
      className={`tv-page tv-page-sakura ${interactive ? "tv-page-interactive" : ""}`}
      interactive={interactive}
    >
      <header className="tv-page-header">
        <div className="tv-live-pill">LIVE</div>
        <div className="tv-time-label">Sakura Broadcast Node</div>
      </header>

      <section className="tv-hero tv-sakura-hero">
        <div className="tv-sakura-window-bar">
          <span />
          <span />
          <span />
          <div className="tv-sakura-window-label">HOME_FEED.EXE</div>
        </div>

        <div className="tv-sakura-hero-grid">
          <div className="tv-sakura-hero-copy">
            <div className="tv-kicker">Channel 01 // Professional Overview</div>
            <h2 className="tv-title tv-sakura-title">Gaurav</h2>
            <p className="tv-sakura-role">Web Developer</p>
            <p className="tv-tagline tv-sakura-tagline">
              Software Engineer 1 at MAQ Software with experience across frontend
              engineering, product-facing web development, and immersive web interfaces
              that balance clarity with visual identity.
            </p>
          </div>

          <aside className="tv-sakura-emblem-card">
            <div className="tv-section-label">Signal Stamp</div>
            <div className="tv-sakura-emblem">
              <div className="tv-sakura-sun" />
              <div className="tv-sakura-grid-lines" />
              <div className="tv-sakura-emblem-copy">
                <span>Tokyo feed</span>
                <span>UI system</span>
                <span>soft signal</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="tv-sakura-grid">
        <article className="tv-featured-card tv-sakura-profile-card">
          <div className="tv-section-label">Current Profile</div>
          <div className="tv-featured-title">Frontend systems with a cleaner visual voice</div>
          <div className="tv-featured-copy">
            I am a web developer who is proficient in front-end frameworks and libraries.
            My passion lies in learning the latest technologies and moving closer to my
            dream project with every build.
          </div>
        </article>

        <article className="tv-featured-card tv-sakura-credentials-card">
          <div className="tv-section-label">Career Snapshot</div>
          <div className="tv-mini-list tv-sakura-mini-list">
            <div>Software Engineer 1 @ MAQ Software</div>
            <div>Ex-ASE @ MAQ Software</div>
            <div>Ex-Web Developer Intern @ PixelBridges</div>
            <div>Student at IIIT Sonepat</div>
          </div>
        </article>
      </section>

      <section className="tv-sakura-ornament-band">
        <div className="tv-sakura-ornament-title">Artifacts</div>
        <div className="tv-sakura-ornament-grid">
          <div className="tv-sakura-ornament-card tv-sakura-ornament-card-wave">
            <div className="tv-sakura-ornament-visual tv-sakura-wave-visual" />
            <div className="tv-sakura-ornament-meta">
              <div className="tv-sakura-ornament-label">Seigaiha</div>
              <div className="tv-sakura-ornament-copy">calm waves / continuity</div>
            </div>
          </div>

          <div className="tv-sakura-ornament-card tv-sakura-ornament-card-seal">
            <div className="tv-sakura-ornament-visual tv-sakura-seal-visual">
              <div className="tv-sakura-seal-mark">
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
            <div className="tv-sakura-ornament-meta">
              <div className="tv-sakura-ornament-label">Hanko</div>
              <div className="tv-sakura-ornament-copy">seal-stamp / personal mark</div>
            </div>
          </div>

          <div className="tv-sakura-ornament-card tv-sakura-ornament-card-hemp">
            <div className="tv-sakura-ornament-visual tv-sakura-hemp-visual" />
            <div className="tv-sakura-ornament-meta">
              <div className="tv-sakura-ornament-label">Asanoha</div>
              <div className="tv-sakura-ornament-copy">growth / geometric lattice</div>
            </div>
          </div>
        </div>
      </section>

      <section className="tv-sakura-band">
        <div className="tv-sakura-band-copy">
          <div className="tv-section-label">Broadcast Note</div>
          <div>
            Professional foundation first. This home feed is designed as the soft-entry
            signal before moving into deeper channels for skills, project work, and
            contact routing.
          </div>
        </div>
        <div className="tv-sakura-band-meter">
          <span className="tv-sakura-band-meter-label">Signal</span>
          <div className="tv-sakura-band-meter-track">
            <div />
          </div>
          <span className="tv-sakura-band-meter-value">01 / HOME</span>
        </div>
      </section>

      <section className="tv-featured-card tv-sakura-scroll-panel">
        <div className="tv-section-label">Focus Areas</div>
        <div className="tv-mini-list tv-sakura-mini-list">
          <div>Frontend engineering with emphasis on maintainable UI systems.</div>
          <div>Interactive web experiences that feel polished and memorable.</div>
          <div>Product-minded execution across landing pages, interfaces, and showcases.</div>
          <div>Continuous learning around modern tooling, 3D web, and performance.</div>
        </div>
      </section>

      <section className="tv-quick-grid tv-sakura-link-grid">
        <a
          className="tv-chip tv-chip-link tv-sakura-link"
          href="https://github.com/malikgaurav626"
          target="_blank"
          rel="noreferrer"
        >
          <span className="tv-sakura-link-kicker">Code</span>
          <span>GitHub Archive</span>
        </a>
        <a
          className="tv-chip tv-chip-link tv-sakura-link"
          href="https://www.linkedin.com/in/malikgaurav626/"
          target="_blank"
          rel="noreferrer"
        >
          <span className="tv-sakura-link-kicker">Profile</span>
          <span>LinkedIn Signal</span>
        </a>
        <a className="tv-chip tv-chip-link tv-sakura-link" href="mailto:malikgaurav626@gmail.com">
          <span className="tv-sakura-link-kicker">Direct</span>
          <span>Email Route</span>
        </a>
      </section>

      <footer className="tv-page-footer">
        <span>Now Broadcasting: Sakura Home Feed</span>
      </footer>
    </TVPageRoot>
  );
}

function ChannelTwoPage({ interactive }) {
  const skillGroups = [
    {
      label: "Frontend Systems",
      value: 91,
      detail: "React, component architecture, responsive UI, maintainable layouts",
    },
    {
      label: "3D / Motion",
      value: 82,
      detail: "Three.js, React Three Fiber, scene storytelling, interaction polish",
    },
    {
      label: "APIs / Data Flow",
      value: 76,
      detail: "REST integration, Firebase-backed flows, product-facing data wiring",
    },
    {
      label: "Delivery Mindset",
      value: 86,
      detail: "Iteration speed, visual polish, implementation ownership, refinement",
    },
  ];

  const stackColumns = [
    {
      label: "Core Stack",
      items: ["React", "JavaScript", "Vite", "HTML", "CSS"],
    },
    {
      label: "Interactive Layer",
      items: ["Three.js", "React Three Fiber", "Animation", "UI Motion"],
    },
    {
      label: "Data & Services",
      items: ["Firebase", "REST APIs", "Async Flows", "State Handling"],
    },
    {
      label: "Workflow",
      items: ["Git", "Debugging", "Iteration", "UI Refinement"],
    },
  ];

  const fieldNotes = [
    "Build interfaces that feel considered, not just functional.",
    "Translate design intent into reliable frontend systems.",
    "Stay comfortable moving between UI polish and implementation detail.",
  ];

  const learningSignals = [
    "Performance-minded frontend architecture",
    "Immersive scene pipelines",
    "Shader-led visual storytelling",
    "Scalable UI systems",
  ];

  return (
    <TVPageRoot
      className={`tv-page tv-page-desert tv-page-desert-dossier ${interactive ? "tv-page-interactive" : ""}`}
      interactive={interactive}
    >
      <header className="tv-page-header">
        <div className="tv-live-pill">ARRAKIS DOSSIER</div>
        <div className="tv-time-label">Desert Capabilities Broadcast</div>
      </header>

      <section className="tv-desert-hero">
        <div>
          <div className="tv-kicker">Channel 02 // Skills Signal</div>
          <h2 className="tv-title">Engineering Toolkit</h2>
        </div>
        <p className="tv-tagline tv-desert-tagline">
          A Dune-inspired transmission of how I work: calm under pressure, structured execution,
          and frontend systems built to survive complexity without losing visual intent.
        </p>
      </section>

      <section className="tv-desert-status-bar">
        <span>Frontend-first</span>
        <span>Interactive UI</span>
        <span>Production mindset</span>
        <span>Always learning</span>
      </section>

      <section className="tv-desert-layout">
        <div className="tv-desert-column tv-desert-column-primary">
          <article className="tv-dossier-card tv-desert-panel">
            <div className="tv-section-label">Field Notes</div>
            <div className="tv-mini-list tv-desert-note-list">
              {fieldNotes.map((item) => (
                <div key={item}>{item}</div>
              ))}
            </div>
          </article>

          <article className="tv-dossier-card tv-desert-panel">
            <div className="tv-section-label">Readiness Levels</div>
            <div className="tv-skill-list tv-desert-skill-list">
              {skillGroups.map((skill) => (
                <div key={skill.label} className="tv-skill-row tv-desert-skill-row">
                  <div className="tv-desert-skill-head">
                    <div className="tv-skill-label">{skill.label}</div>
                    <div className="tv-desert-skill-score">{skill.value}</div>
                  </div>
                  <div className="tv-skill-meter">
                    <div style={{ width: `${skill.value}%` }} />
                  </div>
                  <div className="tv-desert-skill-detail">{skill.detail}</div>
                </div>
              ))}
            </div>
          </article>
        </div>

        <div className="tv-desert-column tv-desert-column-secondary">
          <article className="tv-dossier-card tv-desert-panel">
            <div className="tv-section-label">Stack Map</div>
            <div className="tv-desert-stack-grid">
              {stackColumns.map((column) => (
                <div key={column.label} className="tv-desert-stack-block">
                  <div className="tv-desert-stack-title">{column.label}</div>
                  <div className="tv-tag-cloud tv-desert-tag-cloud">
                    {column.items.map((item) => (
                      <span key={`${column.label}-${item}`}>{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="tv-dossier-card tv-desert-panel">
            <div className="tv-section-label">Signal on the Horizon</div>
            <div className="tv-desert-learning-grid">
              {learningSignals.map((item) => (
                <div key={item} className="tv-desert-learning-chip">
                  {item}
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <footer className="tv-page-footer">
        <span>Broadcast Status: field-ready and tuned for deeper project reveals on channel 03</span>
      </footer>
    </TVPageRoot>
  );
}

function ChannelThreePage({ interactive }) {
  const cases = [
    {
      name: "Portfolio V2",
      category: "Flagship Build",
      summary:
        "An immersive portfolio built around realtime 3D environments, channel-based navigation, and a presentation style designed to feel memorable without losing engineering clarity.",
      stack: ["React", "Vite", "Three.js", "React Three Fiber"],
      role: "Concept, frontend architecture, scene integration, UI direction",
      impact: "Strong proof of interactive frontend craft for portfolio-first screening.",
      liveUrl: "https://example.com/portfolio-v2",
      githubUrl: "https://github.com/example/portfolio-v2",
    },
    {
      name: "Product Landing Experience",
      category: "Launch Surface",
      summary:
        "A product-forward landing page centered on narrative pacing, section transitions, and cleaner visual hierarchy for first-time visitors.",
      stack: ["React", "JavaScript", "CSS", "Animation"],
      role: "Frontend implementation, section design, interaction polish",
      impact: "Shows how marketing pages can feel sharper without becoming noisy.",
      liveUrl: "https://example.com/product-showcase",
      githubUrl: "https://github.com/example/product-showcase",
    },
    {
      name: "Data Interface Dashboard",
      category: "Product System",
      summary:
        "A dashboard-style interface focused on readable data presentation, reusable UI pieces, and practical responsive behavior across screen sizes.",
      stack: ["React", "REST APIs", "State Management", "Charts"],
      role: "UI development, API wiring, state flow, responsive behavior",
      impact: "Balances product engineering needs with a more refined frontend eye.",
      liveUrl: "https://example.com/frontend-dashboard",
      githubUrl: "https://github.com/example/frontend-dashboard",
    },
    {
      name: "Campaign Microsite",
      category: "Brand Surface",
      summary:
        "A compact branded site with tighter messaging, stronger pacing, and a cleaner visual identity built for a focused campaign window.",
      stack: ["HTML", "CSS", "JavaScript", "Motion"],
      role: "Build, styling system, responsive layout, delivery refinement",
      impact: "A useful signal for teams hiring across marketing and product web work.",
      liveUrl: "https://example.com/campaign-microsite",
      githubUrl: "https://github.com/example/campaign-microsite",
    },
  ];

  return (
    <TVPageRoot
      className={`tv-page tv-page-arctic tv-page-arctic-timeline ${interactive ? "tv-page-interactive" : ""}`}
      interactive={interactive}
    >
      <header className="tv-page-header">
        <div className="tv-live-pill">WINTER ARCHIVE</div>
        <div className="tv-time-label">Northern Casebook</div>
      </header>

      <section className="tv-casebook-hero tv-north-hero">
        <div>
          <div className="tv-kicker">Selected Work // Cold Storage</div>
          <h2 className="tv-title">Project Casebook</h2>
        </div>
        <p className="tv-tagline tv-casebook-tagline tv-north-tagline">
          A Northman-inspired archive of frontend work: colder palette, sharper structure, and
          project summaries written to feel more like a record of craft than a glossy sales sheet.
        </p>
      </section>

      <section className="tv-casebook-banner tv-north-banner">
        <span>Snowbound tone</span>
        <span>Frontend craftsmanship</span>
        <span>Scroll the archive</span>
      </section>

      <section className="tv-casebook-feed tv-north-feed">
        {cases.map((item, idx) => (
          <article key={item.name} className="tv-casebook-card tv-north-card">
            <div className="tv-casebook-card-top">
              <div className="tv-casebook-index">0{idx + 1}</div>
              <div className="tv-casebook-head">
                <div className="tv-section-label">{item.category}</div>
                <div className="tv-casebook-title">{item.name}</div>
              </div>
            </div>

            <div className="tv-casebook-summary">{item.summary}</div>

            <div className="tv-casebook-meta">
              <div>
                <span className="tv-casebook-meta-label">Role</span>
                <span className="tv-casebook-meta-value">{item.role}</span>
              </div>
              <div>
                <span className="tv-casebook-meta-label">Value</span>
                <span className="tv-casebook-meta-value">{item.impact}</span>
              </div>
            </div>

            <div className="tv-timeline-tags tv-casebook-tags">
              {item.stack.map((tag) => (
                <span key={`${item.name}-${tag}`}>{tag}</span>
              ))}
            </div>

            <div className="tv-casebook-links">
              <a href={item.liveUrl} target="_blank" rel="noreferrer">
                View Live
              </a>
              <a href={item.githubUrl} target="_blank" rel="noreferrer">
                View Code
              </a>
            </div>
          </article>
        ))}
      </section>

      <footer className="tv-page-footer">
        <span>Archive Status: winter records loaded, placeholder live and GitHub links ready for replacement</span>
      </footer>
    </TVPageRoot>
  );
}

function ChannelFourPage({ interactive }) {
  const missionSignals = [
    "Open to frontend and web developer roles",
    "Strong fit for UI-heavy product teams",
    "Comfortable with interactive and visual web work",
  ];

  const socialLinks = [
    {
      label: "GitHub",
      detail: "Code archive",
      href: "https://github.com/malikgaurav626",
    },
    {
      label: "LinkedIn",
      detail: "Professional channel",
      href: "https://www.linkedin.com/in/malikgaurav626/",
    },
    {
      label: "Instagram",
      detail: "Off-duty signal",
      href: "https://instagram.com/aryannotfit",
    },
    {
      label: "Email",
      detail: "Direct transmission",
      href: "mailto:malikgaurav626@gmail.com",
    },
  ];

  return (
    <TVPageRoot
      className={`tv-page tv-page-space tv-page-space-contact ${interactive ? "tv-page-interactive" : ""}`}
      interactive={interactive}
    >
      <header className="tv-page-header">
        <div className="tv-live-pill">OPEN COMMS</div>
        <div className="tv-time-label">Orbital Contact Console</div>
      </header>

      <section className="tv-space-hero">
        <div>
          <div className="tv-kicker">Channel 04 // Deep Space Contact</div>
          <h2 className="tv-title">Comms Terminal</h2>
        </div>
        <p className="tv-tagline tv-space-tagline">
          Retro-futurist contact lane for hiring conversations, collaboration requests,
          and direct outreach. Built with an 80s sci-fi console feel, but tuned for real-world recruiting.
        </p>
      </section>

      <section className="tv-space-statusbar">
        <span>Hiring signal: open</span>
        <span>Timezone: IST</span>
        <span>Response lane: email + linkedin</span>
      </section>

      <section className="tv-space-layout">
        <div className="tv-space-column">
          <article className="tv-space-card tv-space-card-accent">
            <div className="tv-section-label">Mission Brief</div>
            <div className="tv-mini-list tv-space-note-list">
              {missionSignals.map((item) => (
                <div key={item}>{item}</div>
              ))}
            </div>
          </article>

          <article className="tv-space-card">
            <div className="tv-section-label">Social Dock</div>
            <div className="tv-space-links">
              {socialLinks.map((link) => (
                <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
                  <span>{link.label}</span>
                  <small>{link.detail}</small>
                </a>
              ))}
            </div>
          </article>

          <article className="tv-space-card">
            <div className="tv-section-label">Opportunities Sought</div>
            <div className="tv-space-pill-row">
              <span>Frontend Engineer</span>
              <span>Web Developer</span>
              <span>Interactive UI</span>
              <span>Product Web</span>
            </div>
          </article>
        </div>

        <div className="tv-space-column">
          <article className="tv-space-card tv-space-card-terminal">
            <div className="tv-section-label">Transmission Form</div>
            <form className="tv-contact-form" onSubmit={(event) => event.preventDefault()}>
              <input type="text" placeholder="Name / Company" aria-label="Name or Company" />
              <input type="email" placeholder="Reply Channel" aria-label="Reply Channel" />
              <input type="text" placeholder="Role / Project Type" aria-label="Role or Project Type" />
              <textarea placeholder="Message" aria-label="Message" rows="5" />
              <button type="submit">Transmit Message</button>
            </form>
          </article>

          <article className="tv-space-card">
            <div className="tv-section-label">Preferred Signal Types</div>
            <div className="tv-space-readout-grid">
              <div>
                <span>Product teams</span>
                <strong>Frontend builds</strong>
              </div>
              <div>
                <span>Studios</span>
                <strong>Interactive experiences</strong>
              </div>
              <div>
                <span>Founders</span>
                <strong>Launch websites</strong>
              </div>
              <div>
                <span>Hiring managers</span>
                <strong>Web dev roles</strong>
              </div>
            </div>
          </article>
        </div>
      </section>

      <footer className="tv-page-footer">
        <span>Comms Status: live channels open, form currently staged for future backend wiring</span>
      </footer>
    </TVPageRoot>
  );
}

export function TVScreenPage({ channel = 0, interactive = false }) {
  if (channel === 1) return <ChannelTwoPage interactive={interactive} />;
  if (channel === 2) return <ChannelThreePage interactive={interactive} />;
  if (channel === 3) return <ChannelFourPage interactive={interactive} />;
  return <ChannelOnePage interactive={interactive} />;
}
