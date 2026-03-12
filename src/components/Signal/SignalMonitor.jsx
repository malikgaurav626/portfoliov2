import { useMemo, useState } from "react";
import "./SignalMonitor.css";

const SIGNAL_VARIANTS = [
  { key: "vector", label: "VECTOR SCOPE" },
  { key: "radar", label: "RADAR SWEEP" },
  { key: "waterfall", label: "WATERFALL" },
  { key: "bitstream", label: "BITSTREAM" },
  { key: "vu", label: "DUAL VU" },
  { key: "rings", label: "SYNC RINGS" },
];

const CHANNEL_SIGNAL_COLORS = [
  { primary: "#ff8fc7", muted: "#ffd3eb" },
  { primary: "#f2be7e", muted: "#ffe4c1" },
  { primary: "#9de5ff", muted: "#d8f6ff" },
  { primary: "#ff95f2", muted: "#a7d1ff" },
];

function buildLissajousPath(width = 120, height = 44) {
  const cx = width / 2;
  const cy = height / 2;
  const ampX = width * 0.26;
  const ampY = height * 0.32;
  const points = [];
  const steps = 80;

  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const x = cx + Math.sin(3 * t + Math.PI / 5) * ampX;
    const y = cy + Math.sin(2 * t) * ampY;
    points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }

  return points.join(" ");
}

function renderVariant(variantKey, vectorPath, waterfallBars) {
  if (variantKey === "vector") {
    return (
      <svg viewBox="0 0 120 44" className="signal-svg" role="img" aria-hidden="true">
        <polyline className="signal-grid-line" points="0,22 120,22" />
        <polyline className="signal-vector-path" points={vectorPath} />
      </svg>
    );
  }

  if (variantKey === "radar") {
    return (
      <svg viewBox="0 0 120 44" className="signal-svg signal-svg-radar" role="img" aria-hidden="true">
        <circle className="signal-radar-ring" cx="60" cy="22" r="15" />
        <circle className="signal-radar-ring" cx="60" cy="22" r="10" />
        <circle className="signal-radar-ring" cx="60" cy="22" r="5" />
        <line className="signal-radar-axis" x1="45" y1="22" x2="75" y2="22" />
        <line className="signal-radar-axis" x1="60" y1="7" x2="60" y2="37" />
        <g className="signal-radar-sweep">
          <line x1="60" y1="22" x2="83" y2="22" />
        </g>
        <circle className="signal-radar-blip signal-radar-blip-a" cx="70" cy="14" r="1.2" />
        <circle className="signal-radar-blip signal-radar-blip-b" cx="52" cy="30" r="1.4" />
      </svg>
    );
  }

  if (variantKey === "waterfall") {
    return (
      <div className="signal-waterfall" aria-hidden="true">
        {waterfallBars.map((bar) => (
          <span
            key={bar.key}
            className="signal-waterfall-bar"
            style={{
              left: `${bar.left}%`,
              "--bar-delay": `${bar.delay}s`,
              "--bar-speed": `${bar.speed}s`,
              "--bar-base": bar.base,
              "--bar-swing": bar.swing,
            }}
          />
        ))}
      </div>
    );
  }

  if (variantKey === "bitstream") {
    return (
      <svg viewBox="0 0 120 44" className="signal-svg" role="img" aria-hidden="true">
        <polyline className="signal-grid-line" points="0,22 120,22" />
        <polyline
          className="signal-bitstream-path"
          points="0,28 10,28 10,14 18,14 18,28 28,28 28,20 36,20 36,28 48,28 48,10 56,10 56,28 64,28 64,18 72,18 72,28 84,28 84,12 94,12 94,28 120,28"
        />
      </svg>
    );
  }

  if (variantKey === "vu") {
    return (
      <div className="signal-vu" aria-hidden="true">
        <div className="signal-vu-track">
          <span className="signal-vu-fill signal-vu-fill-a" />
        </div>
        <div className="signal-vu-track">
          <span className="signal-vu-fill signal-vu-fill-b" />
        </div>
        <div className="signal-vu-lock">LOCK 97%</div>
      </div>
    );
  }

  return (
    <div className="signal-sync-rings" aria-hidden="true">
      <span className="signal-ring signal-ring-a" />
      <span className="signal-ring signal-ring-b" />
      <span className="signal-ring signal-ring-c" />
      <span className="signal-ring-core" />
    </div>
  );
}

export function SignalMonitor({
  channel = 0,
  onSignalClick = null,
  compact = false,
}) {
  const [variantIndex, setVariantIndex] = useState(0);
  const variant = SIGNAL_VARIANTS[variantIndex];
  const colors =
    CHANNEL_SIGNAL_COLORS[((channel % CHANNEL_SIGNAL_COLORS.length) + CHANNEL_SIGNAL_COLORS.length) % CHANNEL_SIGNAL_COLORS.length];

  const vectorPath = useMemo(() => buildLissajousPath(), []);

  const waterfallBars = useMemo(
    () =>
      Array.from({ length: 16 }, (_, index) => ({
        key: `bar-${index}`,
        left: 4 + index * 6.2,
        delay: -(index % 6) * 0.19,
        speed: 1.4 + (index % 5) * 0.18,
        base: 0.32 + ((index * 7) % 10) / 19,
        swing: 0.22 + ((index * 5) % 10) / 28,
      })),
    []
  );

  const onPrev = (event) => {
    event.stopPropagation();
    setVariantIndex((prev) => (prev - 1 + SIGNAL_VARIANTS.length) % SIGNAL_VARIANTS.length);
  };

  const onNext = (event) => {
    event.stopPropagation();
    setVariantIndex((prev) => (prev + 1) % SIGNAL_VARIANTS.length);
  };

  return (
    <div
      className={`signal-monitor-shell ${compact ? "signal-monitor-shell-compact" : ""}`}
      style={{
        "--signal-primary": `var(--scene-ui-icon, ${colors.primary})`,
        "--signal-muted": `var(--scene-ui-muted, ${colors.muted})`,
      }}
    >
      <button
        className="signal-variant-nav signal-variant-prev"
        onClick={onPrev}
        type="button"
        aria-label="Previous signal style"
      >
        &#8249;
      </button>

      <div
        className={`signal-monitor signal-monitor-${variant.key}`}
        onClick={onSignalClick}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onSignalClick && onSignalClick(event);
          }
        }}
      >
        {renderVariant(variant.key, vectorPath, waterfallBars)}
        <div className="signal-variant-label">
          {variant.label} {variantIndex + 1}/{SIGNAL_VARIANTS.length}
        </div>
      </div>

      <button
        className="signal-variant-nav signal-variant-next"
        onClick={onNext}
        type="button"
        aria-label="Next signal style"
      >
        &#8250;
      </button>
    </div>
  );
}

