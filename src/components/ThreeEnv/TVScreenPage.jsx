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
                href="https://drive.google.com/file/d/17PKn71erSG5W1sHVrqZyrBwFCGkQN0az/view?usp=sharing"
                target="_blank"
                rel="noreferrer"
              >
                Resume 作品
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
              <span>Email 郵件</span>
              <span>malikgaurav626@gmail.com</span>
            </div>
            <div className="tv-sakura-meta-row">
              <span>Location 地點</span>
              <span>Noida, India</span>
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
              Gaurav - Software Engineer 1 at MAQ Software (full-time since Jul 2025),
              ex-Associate Software Engineer at MAQ and ex-Web Developer Intern at Pixel Bridges,
              with a B.Tech in Computer Engineering from IIIT Sonepat and a focus on frontend
              systems, interactive web products, and practical engineering delivery.
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
      value: 94,
      detail: "React.js, Redux/Redux.js, Next.js, JavaScript libraries, HTML5/CSS, responsive web design",
    },
    {
      label: "Security & QA",
      value: 87,
      detail: "Snyk, Fiddler, Datadog, web app pen-test resolution, end-to-end testing, REST APIs",
    },
    {
      label: "Core Engineering",
      value: 89,
      detail: "C, C++, C#, Python, Java, algorithms, communication, analytical skills",
    },
    {
      label: "Architecture",
      value: 90,
      detail: "System design, Lucidchart, AI agents, project management, computer vision/neural networks",
    },
  ];

  const stackColumns = [
    {
      label: "Core Stack",
      items: ["JavaScript", "React.js", "Next.js", "Redux", "HTML5", "CSS", "Bootstrap", "Vite"],
    },
    {
      label: "Web3 / Product",
      items: ["Web3", "WalletConnect", "WordPress", "Foreign Exchange (FX)", "Finance product UX"],
    },
    {
      label: "Security & Ops",
      items: ["Snyk", "Fiddler", "Datadog", "Pen-test Resolution", "REST APIs", "Git"],
    },
    {
      label: "Creative / AI",
      items: ["Anime.js", "Lottie", "Adobe Photoshop", "Adobe Premiere Pro", "Adobe Audition", "Neural Networks", "OpenCV", "TensorFlow"],
    },
  ];

  const fieldNotes = [
    "Delivered 30+ client websites during internship and freelance work.",
    "Worked across MAQ Software roles from ASE to Software Engineer 1.",
    "Comfortable across implementation, architecture, communication, and product-facing delivery.",
  ];

  const learningSignals = [
    "Advanced system design case studies",
    "AI agent implementation patterns",
    "Web app security hardening",
    "Performance-driven UI architecture",
    "Computer vision + neural network experimentation",
    "Web3 dashboard architecture",
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
      name: "Forex Dominant",
      category: "Trading Platform",
      summary:
        "Online trading services platform with optimized calculator logic for market-accuracy scenarios and production-ready frontend delivery.",
      stack: ["JavaScript", "REST APIs", "WordPress", "Frontend"],
      role: "Web development, calculation logic tuning, deployment support",
      impact: "Improved calculator reliability and user trust in volatile market inputs.",
      liveUrl: "https://forexdominant.com",
      githubUrl: "https://github.com/malikgaurav626",
    },
    {
      name: "Zyrithra",
      category: "Web3 Dashboard",
      summary:
        "A Web3 platform with a live dashboard and polished frontend interactions designed for high-engagement product exploration.",
      stack: ["HTML", "CSS", "JavaScript", "React", "Anime.js"],
      role: "Frontend implementation, dashboard UX, animation integration",
      impact: "Demonstrates dynamic dashboard engineering and UI motion quality.",
      liveUrl: "https://zyrithra.netlify.app",
      githubUrl: "https://github.com/malikgaurav626",
    },
    {
      name: "Cosmic Route",
      category: "3D Interactive Experience",
      summary:
        "A Three.js powered solar-system exploration featuring planet-scale 3D rendering with smooth navigation and scene interaction.",
      stack: ["HTML", "CSS", "JavaScript", "React", "Redux", "Three.js", "R3F"],
      role: "Scene implementation, frontend architecture, interaction tuning",
      impact: "Strong signal for immersive frontend and realtime rendering capability.",
      liveUrl: "https://cosmicroute.netlify.app",
      githubUrl: "https://github.com/malikgaurav626",
    },
    {
      name: "GANs for Efficient Depth Map Estimation",
      category: "ML Research",
      summary:
        "Explored GAN architecture design, training, and evaluation for depth map estimation with practical experimentation workflows.",
      stack: ["Neural Networks", "Python", "TensorFlow", "Pandas", "Math"],
      role: "Model experimentation, training/evaluation pipeline, analysis",
      impact: "Adds applied ML depth alongside frontend-focused engineering work.",
      liveUrl: "https://malikgaurav626.netlify.app",
      githubUrl: "https://github.com/malikgaurav626",
    },
    {
      name: "Neko Noir",
      category: "Game Project",
      summary:
        "A card game built with persistent leaderboard support and single-player flow, created with multimedia tooling and frontend engineering practices.",
      stack: ["React", "HTML", "CSS", "JavaScript", "Bootstrap", "Photoshop", "After Effects"],
      role: "Gameplay UI, state handling, leaderboard data persistence, creative asset integration",
      impact: "Shows productized game UX thinking with practical frontend implementation discipline.",
      liveUrl: "https://malikgaurav626.netlify.app",
      githubUrl: "https://github.com/malikgaurav626",
    },
    {
      name: "VortyX Finance",
      category: "Web3 Product",
      summary:
        "Web3 platform for managing assets with support for 400+ wallets and product-first dashboard UX.",
      stack: ["React", "WalletConnect", "Web3", "Dashboard UI"],
      role: "Frontend implementation, wallet experience, product workflow design",
      impact: "Demonstrates practical Web3 UX delivery for finance workflows.",
      liveUrl: "https://malikgaurav626.netlify.app",
      githubUrl: "https://github.com/malikgaurav626",
    },
    {
      name: "Vexaris (beta)",
      category: "Web3 Dashboard",
      summary:
        "A beta dashboard app for Vexaris with MetaMask support and realtime-style portfolio surfaces.",
      stack: ["React", "Web3", "MetaMask"],
      role: "Dashboard implementation, wallet-connected flow, UI execution",
      impact: "Validated rapid delivery for blockchain-oriented product dashboards.",
      liveUrl: "https://malikgaurav626.netlify.app",
      githubUrl: "https://github.com/malikgaurav626",
    },
    {
      name: "Geode (beta)",
      category: "Staking Library UI",
      summary:
        "Frontend surface for a blockchain staking library concept with product-focused structure and responsive behavior.",
      stack: ["HTML", "CSS", "JavaScript", "React"],
      role: "UI architecture, implementation, responsive polish",
      impact: "Shows strong execution speed on early-stage product concepts.",
      liveUrl: "https://malikgaurav626.netlify.app",
      githubUrl: "https://github.com/malikgaurav626",
    },
    {
      name: "Exo Archives",
      category: "Data Interface",
      summary:
        "React app interface for NASA exoplanet archive data with themed variants and practical data browsing UX.",
      stack: ["React", "Vite", "Bootstrap", "JavaScript"],
      role: "Interface implementation, data presentation, theme system",
      impact: "Demonstrates data-heavy frontend layout control and visual identity handling.",
      liveUrl: "https://malikgaurav626.netlify.app",
      githubUrl: "https://github.com/malikgaurav626",
    },
    {
      name: "Game Ether",
      category: "Next.js Directory",
      summary:
        "Online game directory app built with Next.js/React using APIs for discovery, news, and content updates.",
      stack: ["Next.js", "React", "Redux", "JavaScript", "Bootstrap", "Anime.js"],
      role: "API integration, search/discovery UI, frontend architecture",
      impact: "Strong example of multi-source API product frontend execution.",
      liveUrl: "https://malikgaurav626.netlify.app",
      githubUrl: "https://github.com/malikgaurav626",
    },
    {
      name: "NeoNotes",
      category: "Productivity App",
      summary:
        "A Vite-based notes app with vintage aesthetics and modern interaction behavior.",
      stack: ["React", "Vite", "Bootstrap", "Firebase"],
      role: "UX styling, state handling, app-level implementation",
      impact: "Shows clean execution for lightweight but polished product UX.",
      liveUrl: "https://malikgaurav626.netlify.app",
      githubUrl: "https://github.com/malikgaurav626",
    },
    {
      name: "Flux Player",
      category: "Media App",
      summary:
        "A fast Spotify-API based React music player with practical playback UX.",
      stack: ["React", "Spotify API", "Bootstrap", "JavaScript"],
      role: "API flow wiring, playback UI, frontend implementation",
      impact: "Demonstrates API-driven app construction and interaction reliability.",
      liveUrl: "https://malikgaurav626.netlify.app",
      githubUrl: "https://github.com/malikgaurav626",
    },
    {
      name: "Travel Advisor",
      category: "Maps + Travel",
      summary:
        "Travel advisor app built rapidly with travel APIs and Google Maps/Places integration.",
      stack: ["React", "RapidAPI", "Google Maps API", "Places API", "Bootstrap"],
      role: "API integration, maps UX, rapid product implementation",
      impact: "Shows ability to ship functional, API-heavy experiences quickly.",
      liveUrl: "https://malikgaurav626.netlify.app",
      githubUrl: "https://github.com/malikgaurav626",
    },
    {
      name: "Maze Generator",
      category: "Algorithms",
      summary:
        "Static maze generator using Prim's algorithm in vanilla JavaScript.",
      stack: ["JavaScript", "Algorithms", "HTML", "CSS"],
      role: "Algorithm implementation and visualization",
      impact: "Highlights fundamentals and problem-solving fluency.",
      liveUrl: "https://malikgaurav626.netlify.app",
      githubUrl: "https://github.com/malikgaurav626",
    },
    {
      name: "cybeRRun",
      category: "2D Game",
      summary:
        "A 2D side scroller game created using vanilla JavaScript, HTML, CSS, and Bootstrap.",
      stack: ["JavaScript", "HTML", "CSS", "Bootstrap"],
      role: "Gameplay scripting, UI rendering, interaction logic",
      impact: "Adds game-loop and interaction engineering to the portfolio mix.",
      liveUrl: "https://malikgaurav626.netlify.app",
      githubUrl: "https://github.com/malikgaurav626",
    },
    {
      name: "History Haryana",
      category: "Content Website",
      summary:
        "A history website focused on Haryana, created with HTML, CSS, and JavaScript.",
      stack: ["HTML", "CSS", "JavaScript"],
      role: "Content structure, visual styling, web implementation",
      impact: "Early project showing fundamentals and content-focused web delivery.",
      liveUrl: "https://malikgaurav626.netlify.app",
      githubUrl: "https://github.com/malikgaurav626",
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
            <div className="tv-arctic-config-line tv-arctic-config-line-2">ARTIST // GAURAV</div>
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

            <div
              className="tv-space-cadet-phone-chip tv-space-cadet-phone-chip-disabled"
              aria-label="Call channel visual artifact"
              role="img"
            >
              <span>☎</span>
              <span>CALL</span>
            </div>
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
