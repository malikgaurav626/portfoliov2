import { useState, useEffect } from "react";
import "./Loading.css";

function Loading() {
  const [dialGrowing, setDialGrowing] = useState(false);
  const [dialRotating, setDialRotating] = useState(false);
  const [activeDash, setActiveDash] = useState(-1);

  useEffect(() => {
    // Trigger dial growth animation
    setDialGrowing(true);

    // Start rotation after dial expands
    const rotationTimer = setTimeout(() => {
      setDialRotating(true);
      setActiveDash(0);
    }, 600);

    return () => clearTimeout(rotationTimer);
  }, []);

  // Animate dashes one at a time
  useEffect(() => {
    if (activeDash >= 0 && activeDash < 12) {
      const dashTimer = setTimeout(() => {
        setActiveDash(activeDash + 1);
      }, 150);
      return () => clearTimeout(dashTimer);
    } else if (activeDash >= 12) {
      // All dashes done, stop rotation
      setDialRotating(false);
    }
  }, [activeDash]);

  // Generate 12 dashes around the dial
  const dashes = Array.from({ length: 12 }, (_, i) => (
    <div
      key={i}
      className={`loading-dash ${activeDash > i ? "dash-visible" : ""}`}
      style={{
        transform: `rotate(${i * 30}deg)`,
      }}
    >
      <div className="dash-line"></div>
    </div>
  ));

  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="loading-dial-wrapper">
          {dashes}
          <div
            className={`loading-dial ${
              dialGrowing ? "dial-expanded" : "dial-dot"
            } ${dialRotating ? "dial-rotating" : ""}`}
          >
            <div className="loading-dialer"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loading;
