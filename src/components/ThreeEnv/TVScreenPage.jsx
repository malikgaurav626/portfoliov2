import { useEffect, useRef, useState } from "react";

export const TV_SCREEN_HTML_WIDTH = 620;
export const TV_SCREEN_HTML_HEIGHT = 440;

function stopTvInteraction(event) {
  event.stopPropagation();
}

function shouldAllowTvControlClick(event) {
  return Boolean(event.target?.closest?.('[data-tv-control="true"]'));
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
    if (shouldAllowTvControlClick(event)) {
      if (interactive) pageRef.current?.focus({ preventScroll: true });
      return;
    }

    stopTvInteraction(event);
    if (!interactive) return;
    pageRef.current?.focus({ preventScroll: true });
  }

  function handleWheelCapture(event) {
    stopTvInteraction(event);

    if (!interactive || !pageRef.current) return;

    const computedStyle = window.getComputedStyle(pageRef.current);
    const canScrollY =
      (computedStyle.overflowY === "auto" || computedStyle.overflowY === "scroll") &&
      pageRef.current.scrollHeight > pageRef.current.clientHeight;
    const canScrollX =
      (computedStyle.overflowX === "auto" || computedStyle.overflowX === "scroll") &&
      pageRef.current.scrollWidth > pageRef.current.clientWidth;

    if (!canScrollY && !canScrollX) {
      event.preventDefault();
      return;
    }

    if (canScrollY) pageRef.current.scrollTop += event.deltaY;
    if (canScrollX) pageRef.current.scrollLeft += event.deltaX;
    event.preventDefault();
  }

  function handleTouchStartCapture(event) {
    if (shouldAllowTvControlClick(event)) {
      if (interactive) pageRef.current?.focus({ preventScroll: true });
      return;
    }

    stopTvInteraction(event);
    if (!interactive) return;
    pageRef.current?.focus({ preventScroll: true });
  }

  function handleClickCapture(event) {
    if (shouldAllowTvControlClick(event)) return;
    stopTvInteraction(event);
  }

  return (
    <div
      ref={pageRef}
      className={className}
      tabIndex={interactive ? 0 : -1}
      onPointerDownCapture={handlePointerDownCapture}
      onClickCapture={handleClickCapture}
      onWheelCapture={handleWheelCapture}
      onTouchStartCapture={handleTouchStartCapture}
    >
      {children}
      <span className="tv-crt-bloom" aria-hidden="true" />
    </div>
  );
}

function ChannelOnePage({ interactive }) {
  return (
    <TVPageRoot
      className={`tv-page tv-page-sakura ${interactive ? "tv-page-interactive" : ""}`}
      interactive={interactive}
    >
      <div className="tv-sakura-shell">
        <header className="tv-sakura-browser-bar">
          <div className="tv-sakura-browser-icons">
            <span />
            <span />
            <span />
          </div>
          <div className="tv-sakura-browser-url">https://ip.axis.industrial.studio</div>
          <div className="tv-sakura-browser-actions">
            <span />
            <span />
            <span />
          </div>
        </header>

        <section className="tv-sakura-top-grid">
          <div className="tv-sakura-nav-col">
            <div className="tv-sakura-nav-title">Projects 産品</div>
            <div>/interfaces 画面</div>
            <div>/frontend systems</div>
            <div>/interactive web</div>
            <div>/shipping builds</div>
          </div>

          <div className="tv-sakura-nav-col">
            <div className="tv-sakura-nav-title">Lookbook 時間層</div>
            <div>/channel-1 sakura</div>
            <div>/channel-2 desert</div>
            <div>/channel-3 arctic</div>
            <div>/channel-4 space</div>
          </div>

          <div className="tv-sakura-nav-col tv-sakura-nav-col-brand">
            <div className="tv-sakura-nav-title">Brand 品牌</div>

            <div className="tv-sakura-nav-links">
              <a
                className="tv-sakura-nav-link"
                href="https://www.linkedin.com/in/malikgaurav626/"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
              <br />
              <a className="tv-sakura-nav-link" href="mailto:malikgaurav626@gmail.com">
                Email
              </a>
              <br />
            </div>
          </div>

          <div className="tv-sakura-cart-panel">
            <div className="tv-sakura-cart-title">Cart 大区 [01]</div>
            <div className="tv-sakura-cart-grid">
              {Array.from({ length: 8 }).map((_, index) => (
                <span key={`cart-box-${index}`} />
              ))}
            </div>
          </div>
        </section>

        <section className="tv-sakura-stage">
          <div className="tv-sakura-stage-rulers">
            <span>Hypertext</span>
            <span>Transfer</span>
            <span>Protocol</span>
            <span>Secure</span>
            <span>//</span>
            <span>World</span>
            <span>Wide</span>
            <span>Web</span>
            <span>IP</span>
            <span>Axis</span>
            <span>Industrial</span>
            <span>Studio</span>
          </div>

          <div className="tv-sakura-stage-scene">
            <div className="tv-sakura-stage-columns">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="tv-sakura-stage-figures">
              <span className="tv-sakura-figure tv-sakura-figure-a" />
              <span className="tv-sakura-figure tv-sakura-figure-b" />
              <span className="tv-sakura-figure tv-sakura-figure-c" />
              <span className="tv-sakura-figure tv-sakura-figure-d" />
              <span className="tv-sakura-figure tv-sakura-figure-e" />
            </div>

            <div className="tv-sakura-hero-mark">
              <div className="tv-sakura-hero-kana">ガウラヴ</div>
              <div className="tv-sakura-hero-jp">軸域工業</div>
              <div className="tv-sakura-hero-en">GAURAV INDUSTRIAL</div>
            </div>
            <a
                className="tv-sakura-cta"
                href="https://github.com/malikgaurav626"
                target="_blank"
                rel="noreferrer"
              >
                Projects 作品
              </a>

          </div>
        </section>

        <footer className="tv-sakura-footer-grid">
          <div className="tv-sakura-stamp-card">
            <div className="tv-sakura-stamp-symbol">
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="tv-sakura-stamp-copy">
              <div>Trademark 商標</div>
              <div>GAURAV INDUSTRIAL</div>
            </div>
          </div>

          <div className="tv-sakura-meta-card">
            <div className="tv-sakura-meta-row">
              <span>Company 公司</span>
              <span>malikgaurav626</span>
            </div>
            <div className="tv-sakura-meta-row">
              <span>Designer 設計師</span>
              <span>Gaurav Malik</span>
            </div>
          </div>

          <div className="tv-sakura-meta-card">
            <div className="tv-sakura-meta-row">
              <span>Date 日期</span>
              <span>24/03/2026</span>
            </div>
            <div className="tv-sakura-meta-row">
              <span>Time 時刻</span>
              <span>16:20:40</span>
            </div>
          </div>

          <div className="tv-sakura-note-card">
            <div className="tv-sakura-note-title">Description 所有</div>
            <p>
              Software Engineer 1 at MAQ Software building frontend systems, interactive
              UI, and product-facing web experiences with a sharper industrial visual language.
            </p>
          </div>
        </footer>
      </div>
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

  function renderLogoGlyphs(text, keyPrefix) {
    return text.split("").map((char, index) => (
      <span
        key={`${keyPrefix}-${index}-${char === " " ? "space" : char}`}
        className={`tv-desert-logo-glyph ${char === " " ? "tv-desert-logo-glyph-space" : ""}`}
        style={{ "--glyph-delay": `${index * 75}ms` }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  }

  return (
    <TVPageRoot
      className={`tv-page tv-page-desert tv-page-desert-romulus ${interactive ? "tv-page-interactive" : ""}`}
      interactive={interactive}
    >
      <div className="tv-desert-poster">
        <div className="tv-desert-hud" aria-hidden="true">
          <div className="tv-desert-hud-left">
            <span>01 NEW MERCAT</span>
            <span>02 HORIZONTAL</span>
            <span>03 VERTICAL</span>
            <span>04 PIXEL</span>
          </div>
          <div className="tv-desert-hud-right">
            <span className="tv-desert-blip-download">(_) DOWNLOADING......</span>
            <span className="tv-desert-blip-arrows">&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;</span>
            <span className="tv-desert-blip-counter">= 01234</span>
          </div>
        </div>

        <header className="tv-desert-poster-head">
          <div className="tv-desert-strip" aria-hidden="true">
            <span>FRONTEND-FIRST</span>
            <span>INTERACTIVE UI</span>
            <span>PRODUCTION MINDSET</span>
            <span>ALWAYS LEARNING</span>
          </div>
          <div className="tv-desert-meta-line">
            <span>DESERT ERROR TERMINAL</span>
            <span>CH-02 // SKILLS SIGNAL</span>
            <span>VISUAL FEED 2026</span>
          </div>
        </header>

        <section className="tv-desert-poster-center">
          <div className="tv-desert-logo-wrap">
            <span className="tv-desert-logo-rule" />
            <h2 className="tv-desert-logo" aria-label="Error 404 skills status">
              <span className="tv-desert-logo-switch" aria-hidden="true">
                <span className="tv-desert-logo-text tv-desert-logo-text-error">
                  {renderLogoGlyphs("ERROR 404", "error")}
                </span>
                <span className="tv-desert-logo-text tv-desert-logo-text-skills">
                  {renderLogoGlyphs("SKILLS", "skills")}
                </span>
              </span>
            </h2>
            <span className="tv-desert-logo-rule" />
          </div>
          <p className="tv-desert-poster-tagline">
            INSERT USER // OPERATOR FEED: calm under pressure, structured execution,
            and frontend systems built to survive complexity without losing visual intent.
          </p>
        </section>

        <section className="tv-desert-credit-grid">
          <article className="tv-desert-hover-card" tabIndex={0}>
            <div className="tv-desert-credit-title">Readiness Modules</div>
            <p className="tv-desert-card-preview">4 capability lanes calibrated for delivery.</p>
            <div className="tv-desert-card-detail">
              {skillGroups.map((skill) => (
                <p key={skill.label}>
                  <strong>{skill.label} [{skill.value}]</strong>
                  <span>{skill.detail}</span>
                </p>
              ))}
            </div>
          </article>

          <article className="tv-desert-hover-card" tabIndex={0}>
            <div className="tv-desert-credit-title">Field Logs</div>
            <p className="tv-desert-card-preview">Execution stays clear under complexity pressure.</p>
            <div className="tv-desert-card-detail">
              {fieldNotes.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </article>

          <article className="tv-desert-hover-card" tabIndex={0}>
            <div className="tv-desert-credit-title">Stack Registry</div>
            <p className="tv-desert-card-preview">Core stack, interactive layer, data, and workflow.</p>
            <div className="tv-desert-card-detail">
              {stackColumns.map((column) => (
                <p key={column.label}>
                  <strong>{column.label}</strong>
                  <span>{column.items.join(" / ")}</span>
                </p>
              ))}
            </div>
          </article>

          <article className="tv-desert-hover-card" tabIndex={0}>
            <div className="tv-desert-credit-title">Horizon Signals</div>
            <p className="tv-desert-card-preview">Hover to view all active growth tracks.</p>
            <div className="tv-desert-card-detail tv-desert-card-detail-horizon">
              {learningSignals.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </article>
        </section>

        <footer className="tv-desert-footer-note">
          <span className="tv-desert-blip-status">ERROR.50555 // STATUS: FIELD-READY // NEXT TRANSMISSION: CHANNEL 03</span>
        </footer>
      </div>
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
    {
      name: "Interactive Hiring Board",
      category: "Recruiter Utility",
      summary:
        "A recruiter-first board designed to surface role-fit signals quickly, combining short summaries with direct pathways into deeper portfolio artifacts.",
      stack: ["React", "UI Systems", "Data Modeling", "Animation"],
      role: "Information architecture, interaction design, frontend implementation",
      impact: "Improves scan speed for hiring teams without flattening project context.",
      liveUrl: "https://example.com/interactive-hiring-board",
      githubUrl: "https://github.com/example/interactive-hiring-board",
    },
    {
      name: "Immersive Product Gallery",
      category: "Experience Surface",
      summary:
        "A narrative product gallery with cinematic section pacing and lightweight 3D framing for premium launches and announcement moments.",
      stack: ["React", "Three.js", "GSAP", "Performance"],
      role: "Scene orchestration, responsive behavior, motion polish",
      impact: "Demonstrates controlled visual ambition with production-minded implementation.",
      liveUrl: "https://example.com/immersive-product-gallery",
      githubUrl: "https://github.com/example/immersive-product-gallery",
    },
    {
      name: "Realtime Ops Console",
      category: "Dashboard System",
      summary:
        "An operations console presenting health metrics, incidents, and workflow state transitions through a dense but readable modular interface.",
      stack: ["React", "WebSockets", "REST APIs", "State Management"],
      role: "UI architecture, realtime data flow, component strategy",
      impact: "Balances high information density with practical user clarity.",
      liveUrl: "https://example.com/realtime-ops-console",
      githubUrl: "https://github.com/example/realtime-ops-console",
    },
    {
      name: "Campaign Control Deck",
      category: "Marketing Tools",
      summary:
        "A control interface for campaign teams to coordinate launches, asset states, and timeline checkpoints in a unified frontend surface.",
      stack: ["React", "Forms", "Validation", "Design Tokens"],
      role: "Workflow mapping, form architecture, visual QA",
      impact: "Supports faster campaign iteration with clearer collaboration touchpoints.",
      liveUrl: "https://example.com/campaign-control-deck",
      githubUrl: "https://github.com/example/campaign-control-deck",
    },
    {
      name: "Frontline Metrics Canvas",
      category: "Data Storytelling",
      summary:
        "A visual metrics canvas focused on trend communication, temporal comparisons, and decision-support readouts for product owners.",
      stack: ["React", "Charts", "Data Viz", "Accessibility"],
      role: "Visualization strategy, interaction tuning, implementation",
      impact: "Turns raw metrics into more actionable product narratives.",
      liveUrl: "https://example.com/frontline-metrics-canvas",
      githubUrl: "https://github.com/example/frontline-metrics-canvas",
    },
    {
      name: "Signal QA Workbench",
      category: "Quality Surface",
      summary:
        "A QA-first workspace focused on interaction checks, visual regressions, and release confidence for frontend-heavy delivery teams.",
      stack: ["React", "Testing", "Storybook", "CI"],
      role: "Test planning, UI validation flow, component review process",
      impact: "Reduces regressions while keeping iteration speed high.",
      liveUrl: "https://example.com/signal-qa-workbench",
      githubUrl: "https://github.com/example/signal-qa-workbench",
    },
    {
      name: "Launch Narrative Engine",
      category: "Brand Experience",
      summary:
        "A narrative engine for launch pages that sequences copy, media, and interaction states into a clear story arc.",
      stack: ["React", "Motion", "Content Systems", "Performance"],
      role: "Narrative structure, section choreography, implementation",
      impact: "Helps product stories feel intentional and easier to follow.",
      liveUrl: "https://example.com/launch-narrative-engine",
      githubUrl: "https://github.com/example/launch-narrative-engine",
    },
  ];

  const programsPerPage = 4;
  const totalPages = Math.max(1, Math.ceil(cases.length / programsPerPage));
  const [dossierPage, setDossierPage] = useState(0);
  const [pageDirection, setPageDirection] = useState("next");

  const pageStartIndex = dossierPage * programsPerPage;
  const currentPageCases = cases.slice(pageStartIndex, pageStartIndex + programsPerPage);
  const featureCase = currentPageCases[0] || cases[0];
  const miniCases = currentPageCases.slice(1);

  function goToPrevPage() {
    setPageDirection("prev");
    setDossierPage((prev) => (prev - 1 + totalPages) % totalPages);
  }

  function goToNextPage() {
    setPageDirection("next");
    setDossierPage((prev) => (prev + 1) % totalPages);
  }

  function shieldTvControlEvent(event) {
    event.stopPropagation();
  }

  useEffect(() => {
    if (!interactive) return undefined;

    function handleKeyDown(event) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setPageDirection("prev");
        setDossierPage((prev) => (prev - 1 + totalPages) % totalPages);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        setPageDirection("next");
        setDossierPage((prev) => (prev + 1) % totalPages);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [interactive, totalPages]);

  return (
    <TVPageRoot
      className={`tv-page tv-page-arctic tv-page-arctic-lab ${interactive ? "tv-page-interactive" : ""}`}
      interactive={interactive}
    >
      <div className="tv-arctic-sheet">
        <header className="tv-arctic-header-grid">
          <div className="tv-arctic-title-block">
            <div className="tv-arctic-kicker"># CERTAIN UNCERTAINTIES //</div>
            <h2 className="tv-arctic-main-title">PROJECT FLAME 3</h2>
            <div className="tv-arctic-subtitle-row">
              <div className="tv-arctic-subtitle">Selected Work Dossier [Vol.2]</div>
              <div className="tv-arctic-dossier-nav">
                <button
                  type="button"
                  className="tv-arctic-dossier-arrow"
                  data-tv-control="true"
                  onPointerDown={shieldTvControlEvent}
                  onClick={(event) => {
                    shieldTvControlEvent(event);
                    goToPrevPage();
                  }}
                  onTouchStart={shieldTvControlEvent}
                  aria-label="Previous dossier page"
                >
                  ◀
                </button>
                <span>
                  Pg {dossierPage + 1}/{totalPages}
                </span>
                <span className="tv-arctic-dossier-hint">(←/→)</span>
                <button
                  type="button"
                  className="tv-arctic-dossier-arrow"
                  data-tv-control="true"
                  onPointerDown={shieldTvControlEvent}
                  onClick={(event) => {
                    shieldTvControlEvent(event);
                    goToNextPage();
                  }}
                  onTouchStart={shieldTvControlEvent}
                  aria-label="Next dossier page"
                >
                  ▶
                </button>
              </div>
            </div>
          </div>
          <div className="tv-arctic-config-block">
            <div className="tv-arctic-config-line tv-arctic-config-line-1">[CONFIG.TEAM] // 333 LAB</div>
            <div className="tv-arctic-config-line tv-arctic-config-line-2">ARTIST // GAURAV MALIK</div>
            <div className="tv-arctic-config-line tv-arctic-config-line-3">PLANNER // FRONTEND SYSTEMS</div>
            <div className="tv-arctic-config-line tv-arctic-config-line-4">CURATOR // CHANNEL 03</div>
          </div>
        </header>

        <div key={`dossier-page-${dossierPage}`} className={`tv-arctic-page-shell tv-arctic-page-shell-${pageDirection}`}>
          <section className="tv-arctic-feature-card">
            <div className="tv-arctic-feature-head">
              <span>Program {String(pageStartIndex + 1).padStart(2, "0")}</span>
              <span>{featureCase.category}</span>
            </div>
            <h3>{featureCase.name}</h3>
            <p>{featureCase.summary}</p>
            <div className="tv-arctic-feature-meta">
              <div>
                <strong>Role</strong>
                <span>{featureCase.role}</span>
              </div>
              <div>
                <strong>Impact</strong>
                <span>{featureCase.impact}</span>
              </div>
            </div>
            <div className="tv-arctic-feature-tags">
              {featureCase.stack.map((tag) => (
                <span key={`feature-${featureCase.name}-${tag}`}>{tag}</span>
              ))}
            </div>
          </section>

          <section className="tv-arctic-mini-grid">
            {miniCases.map((item, idx) => (
              <article key={item.name} className="tv-arctic-mini-card">
                <div className="tv-arctic-mini-top">
                  <span>{String(pageStartIndex + idx + 2).padStart(2, "0")}</span>
                  <span>{item.category}</span>
                </div>
                <h4>{item.name}</h4>
                <p>{item.summary}</p>
                <div className="tv-arctic-mini-links">
                  <a href={item.liveUrl} target="_blank" rel="noreferrer">
                    Live
                  </a>
                  <a href={item.githubUrl} target="_blank" rel="noreferrer">
                    Code
                  </a>
                </div>
              </article>
            ))}
          </section>
        </div>

        <footer className="tv-arctic-footer-grid">
          <div>Launch Time // 2025.03.22</div>
          <div>Duration // 03.22 -&gt; 06.29</div>
          <div>Status // Arctic records loaded</div>
        </footer>
      </div>
    </TVPageRoot>
  );
}

function ChannelFourPage({ interactive }) {
  const socialLinks = [
    {
      label: "GitHub",
      detail: "CODE ARCHIVE",
      href: "https://github.com/malikgaurav626",
    },
    {
      label: "LinkedIn",
      detail: "PROFESSIONAL CHANNEL",
      href: "https://www.linkedin.com/in/malikgaurav626/",
    },
    {
      label: "Instagram",
      detail: "OFF-DUTY SIGNAL",
      href: "https://instagram.com/aryannotfit",
    },
    {
      label: "Email",
      detail: "DIRECT TRANSMISSION",
      href: "mailto:malikgaurav626@gmail.com",
    },
  ];

  function handleContactSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const subject = encodeURIComponent(`Contact signal from ${name || "portfolio visitor"}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);

    window.location.href = `mailto:malikgaurav626@gmail.com?subject=${subject}&body=${body}`;
  }

  return (
    <TVPageRoot
      className={`tv-page tv-page-space-cadet ${interactive ? "tv-page-interactive" : ""}`}
      interactive={interactive}
    >
      <div className="tv-space-cadet-shell">
        <section className="tv-space-cadet-loader-panel">
          <div className="tv-space-cadet-loader-head">&gt;LOADING NTT CYBERSPACE TELEPHONE...</div>
          <div className="tv-space-cadet-loader-sub">&gt;CURRENT RATE: 0.0001 BTC/MIN</div>
        </section>

        <div className="tv-space-cadet-loader-line" />

        <section className="tv-space-cadet-mid-grid">
          <section className="tv-space-cadet-message" aria-label="terminal thank-you message">
            <p>THANK YOU FOR USING</p>
            <p>NIPPON TELEGRAPH AND TELEPHONE</p>
            <p className="tv-space-cadet-jp">日本電信電話を</p>
            <p className="tv-space-cadet-jp">ご利用いただきありがとうございます</p>
          </section>

          <section className="tv-space-cadet-callbox">
            <div className="tv-space-cadet-callbox-inner">
              <div className="tv-space-cadet-call-title">NEOTOKYO HOME SHOPPING</div>
              <div className="tv-space-cadet-call-number">
                1-800-<span aria-hidden="true">████</span>
              </div>
              <div className="tv-space-cadet-call-state">CALLING...</div>
              <div className="tv-space-cadet-loader-progress" aria-hidden="true">
                <div>
                  <i />
                </div>
              </div>
            </div>

            <a
              className="tv-space-cadet-phone-chip"
              href="tel:+18000000000"
              aria-label="Call channel"
            >
              <span>☎</span>
              <span>CALL</span>
            </a>
          </section>
        </section>

        <section className="tv-space-cadet-links-grid">
          {socialLinks.map((link) => (
            <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
              <strong>{link.label}</strong>
              <span>{link.detail}</span>
            </a>
          ))}
        </section>

        <form className="tv-space-cadet-contact-form" data-tv-control="true" onSubmit={handleContactSubmit}>
          <div className="tv-space-cadet-contact-head">CONTACT TERMINAL</div>

          <div className="tv-space-cadet-contact-grid">
            <label className="tv-space-cadet-field">
              <span>NAME</span>
              <input type="text" name="name" autoComplete="name" required />
            </label>

            <label className="tv-space-cadet-field">
              <span>EMAIL</span>
              <input type="email" name="email" autoComplete="email" required />
            </label>

            <label className="tv-space-cadet-field tv-space-cadet-field-wide">
              <span>MESSAGE</span>
              <textarea name="message" rows={1} maxLength={220} required />
            </label>
          </div>

          <button type="submit" className="tv-space-cadet-send-btn">
            SEND SIGNAL
          </button>

          <div className="tv-space-cadet-contact-artifact" aria-hidden="true">
            <span>TX-04</span>
            <span>◣◢◣</span>
            <span>SYNC OK</span>
          </div>
        </form>
      </div>
    </TVPageRoot>
  );
}

export function TVScreenPage({ channel = 0, interactive = false }) {
  if (channel === 1) return <ChannelTwoPage interactive={interactive} />;
  if (channel === 2) return <ChannelThreePage interactive={interactive} />;
  if (channel === 3) return <ChannelFourPage interactive={interactive} />;
  return <ChannelOnePage interactive={interactive} />;
}
