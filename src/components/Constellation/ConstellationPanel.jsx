import { useMemo } from "react";
import "./ConstellationPanel.css";

const CONSTELLATION_THEMES = [
  { label: "SAKURA ORBIT", accent: "#ff8cc8", trail: "#ffd3ec" },
  { label: "DESERT ORBIT", accent: "#ffc27d", trail: "#ffe6bf" },
  { label: "ARCTIC ORBIT", accent: "#8fe1ff", trail: "#d5f4ff" },
  { label: "NEON ORBIT", accent: "#ff8cff", trail: "#86cbff" },
];

function seededRandom(seed) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function createStars(channel, compact) {
  const count = compact ? 14 : 18;
  return Array.from({ length: count }, (_, index) => {
    const seed = channel * 71 + index * 41 + 19;
    return {
      id: `star-${channel}-${index}`,
      x: 6 + seededRandom(seed + 1) * 88,
      y: 8 + seededRandom(seed + 2) * 80,
      size: 1.6 + seededRandom(seed + 3) * (compact ? 3 : 3.6),
      delay: -seededRandom(seed + 4) * 5,
      duration: 1.9 + seededRandom(seed + 5) * 2.6,
      glow: 0.35 + seededRandom(seed + 6) * 0.55,
    };
  });
}

function createLinks(stars, compact) {
  const chainCount = compact ? 7 : 10;
  const nodes = stars.slice(0, chainCount + 1);
  const links = [];

  for (let i = 0; i < nodes.length - 1; i++) {
    const start = nodes[i];
    const end = nodes[i + 1];
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    links.push({
      id: `link-${i}`,
      x: start.x,
      y: start.y,
      width: Math.sqrt(dx * dx + dy * dy),
      angle: (Math.atan2(dy, dx) * 180) / Math.PI,
      opacity: 0.24 + (i % 3) * 0.08,
    });
  }

  return links;
}

export function ConstellationPanel({ channel = 0, compact = false }) {
  const theme =
    CONSTELLATION_THEMES[((channel % CONSTELLATION_THEMES.length) + CONSTELLATION_THEMES.length) % CONSTELLATION_THEMES.length];

  const stars = useMemo(() => createStars(channel, compact), [channel, compact]);
  const links = useMemo(() => createLinks(stars, compact), [compact, stars]);

  return (
    <div
      className={`constellation-panel ${compact ? "constellation-panel-compact" : ""}`}
      style={{
        "--const-accent": theme.accent,
        "--const-trail": theme.trail,
      }}
    >
      <div className="constellation-panel-header">
        <span className="constellation-panel-kicker">SAT-LINK</span>
        <span className="constellation-panel-mode">{theme.label}</span>
      </div>

      <div className="constellation-panel-scope" aria-hidden="true">
        <div className="constellation-panel-grid" />
        <div className="constellation-panel-sweep" />

        {links.map((link) => (
          <span
            key={link.id}
            className="constellation-link"
            style={{
              left: `${link.x}%`,
              top: `${link.y}%`,
              width: `${link.width}%`,
              transform: `translateY(-50%) rotate(${link.angle}deg)`,
              opacity: link.opacity,
            }}
          />
        ))}

        {stars.map((star) => (
          <span
            key={star.id}
            className="constellation-star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              "--twinkle-delay": `${star.delay}s`,
              "--twinkle-duration": `${star.duration}s`,
              "--star-glow": star.glow,
            }}
          />
        ))}
      </div>

      <div className="constellation-panel-status">ORBITAL FEED // SYNC LOCKED</div>
    </div>
  );
}

