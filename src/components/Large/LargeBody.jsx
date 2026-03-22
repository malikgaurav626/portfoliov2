import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { ControlBar } from "../ControlBar/ControlBar";
import { ThreeEnv } from "../ThreeEnv/ThreeEnv";
import { ConstellationPanel } from "../Constellation/ConstellationPanel";
import { SignalMonitor } from "../Signal/SignalMonitor";
import {
  RecruiterPanel,
  RecruiterPanelIcon,
  getRecruiterPanelConfig,
} from "../RecruiterPanel/RecruiterPanel";

export function LargeBody({
  projects,
  currentProject,
  setCurrentProject,
  isPlaying,
  setisPlaying,
  currentMode,
  setCurrentMode,
  loadingComplete,
}) {
  const [rightSectionVisible, setRightSectionVisible] = useState(false);
  const [leftSectionVisible, setLeftSectionVisible] = useState(false);
  const [currentChannel, setCurrentChannel] = useState(0);
  const [recruiterDisplayChannel, setRecruiterDisplayChannel] = useState(0);
  const [recruiterTypingOut, setRecruiterTypingOut] = useState(false);
  const [recruiterFadingOut, setRecruiterFadingOut] = useState(false);
  const [view3d, setView3d] = useState(true);
  const [homeResetSignal, setHomeResetSignal] = useState(0);
  const [windEnabled, setWindEnabled] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const rootRef = useRef(null);
  const channels = [
    "CHANNEL 1 / SAKURA",
    "CHANNEL 2 / DESERT",
    "CHANNEL 3 / ARCTIC",
    "CHANNEL 4 / SPACE",
  ];
  const projectCount = Object.keys(projects).length;
  const channelCount = channels.length;

  // Animate sections in after loading is complete
  useEffect(() => {
    if (loadingComplete) {
      setLeftSectionVisible(true);
      setRightSectionVisible(true);
    }
  }, [loadingComplete]);

  function handleDialClick(event) {
    const projectCount = Object.keys(projects).length;
    if (projectCount === 0) return;
    setCurrentProject((currentProject + 1) % projectCount);
  }

  function handleBackControl() {
    if (view3d) {
      setCurrentChannel((prev) => (prev - 1 + channelCount) % channelCount);
      return;
    }
    if (!projectCount) return;
    setCurrentProject((prev) => (prev - 1 + projectCount) % projectCount);
  }

  function handleNextControl() {
    if (view3d) {
      setCurrentChannel((prev) => (prev + 1) % channelCount);
      return;
    }
    if (!projectCount) return;
    setCurrentProject((prev) => (prev + 1) % projectCount);
  }

  function handlePlayPauseControl() {
    if (view3d) {
      setWindEnabled((prev) => !prev);
      return;
    }
    setisPlaying(!isPlaying);
  }

  function handleHomeReset() {
    setCurrentProject(0);
    setCurrentChannel(0);
    setView3d(true);
    setHomeResetSignal((prev) => prev + 1);
  }

  const modeValue = currentMode;
  const controlPlayState = view3d ? windEnabled : isPlaying;
  const modeTitle = "DISPLAY MODE";
  const leftModeLabel = "DARK";
  const rightModeLabel = "LIGHT";
  const sceneTime = "night";
  const recruiterPanel = getRecruiterPanelConfig(recruiterDisplayChannel);

  useEffect(() => {
    if (currentChannel === recruiterDisplayChannel) {
      setRecruiterTypingOut(false);
      setRecruiterFadingOut(false);
      return undefined;
    }

    const typeOutDuration = 360;
    const fadeOutDuration = 220;

    setRecruiterTypingOut(true);
    setRecruiterFadingOut(false);

    const typeOutTimeout = window.setTimeout(() => {
      setRecruiterTypingOut(false);
      setRecruiterFadingOut(true);
    }, typeOutDuration);

    const swapTimeout = window.setTimeout(() => {
      setRecruiterDisplayChannel(currentChannel);
      setRecruiterFadingOut(false);
    }, typeOutDuration + fadeOutDuration);

    return () => {
      window.clearTimeout(typeOutTimeout);
      window.clearTimeout(swapTimeout);
    };
  }, [currentChannel, recruiterDisplayChannel]);

  useEffect(() => {
    let qrColor = currentMode === 1 ? "#dec0f7" : "#0030ff";
    if (view3d && rootRef.current) {
      const cssQr = getComputedStyle(rootRef.current)
        .getPropertyValue("--scene-ui-qr")
        .trim();
      if (cssQr) qrColor = cssQr;
    }
    generateQrCode("https://www.linkedin.com/in/malikgaurav626/", qrColor);
  }, [view3d, currentMode, currentChannel]);

  return (
    <>
      <div
        ref={rootRef}
        className={`container ${
          view3d ? `scene-ui-active scene-ch-${currentChannel} scene-time-${sceneTime}` : ""
        }`}
      >
        <div
          className={`left-section ${
            leftSectionVisible ? "visible" : "hidden"
          }`}
        >
          <div className="header">
            <div className="heading-container">
              <div className="heading rgb-split">GaURaV</div>
              <div className="heading-nav">
                <span className="heading-nav-item">
                  WEB DEVELOPER - ML ENGINEER
                </span>
                <div>
                  <span className="heading-nav-item">24HRS</span>
                  <span className="heading-nav-item"> 7 DAYS A WEEK</span>
                  <span className="heading-nav-item">ALL YEAR</span>
                </div>
              </div>
            </div>
            <div className="fading-stripes"></div>
          </div>
          <div className="project-details">
            <div
              className="home-btn"
              onClick={handleHomeReset}
            >
              <span id="home-title-id">HOME</span>{" "}
              <PowerIcon />
            </div>
            <div className="horizontal-row"></div>
            <div className="circular-dial-container">
              <div className="signal">SIGNAL</div>
              <SignalMonitor channel={currentChannel} onSignalClick={handleDialClick} />
              <div className="frequency">
                {Object.keys(projects).length > 0
                  ? `${Math.round(
                      ((currentProject + 1) / Object.keys(projects).length) *
                        89 +
                        10
                    )} KHZ`
                  : "10 KHZ"}
              </div>
            </div>
            <div className="horizontal-row"></div>
          </div>

          <div className="brightness-mode">
            {view3d ? (
              <ConstellationPanel channel={currentChannel} />
            ) : (
              <>
                <div className="brightness-title">{modeTitle}</div>
                <div className="mode-toggle-container">
                  <div
                    className={"toggle-btn " + (modeValue == 1 && "active-btn")}
                    onClick={() => setCurrentMode(1)}
                  ></div>
                  <div
                    className={"toggle-btn " + (modeValue == 0 && "active-btn")}
                    onClick={() => setCurrentMode(0)}
                  ></div>
                </div>
                <div className="btn-container">
                  <div
                    className={
                      "psuedo-btn " + (modeValue == 1 && "active-psuedo-btn")
                    }
                    onClick={() => setCurrentMode(1)}
                  >
                    {leftModeLabel}
                  </div>
                  <div
                    className={
                      "psuedo-btn " + (modeValue == 0 && "active-psuedo-btn")
                    }
                    onClick={() => setCurrentMode(0)}
                  >
                    {rightModeLabel}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="left-footer-wrapper">
            <ControlBar
              isPlaying={controlPlayState}
              setisPlaying={setisPlaying}
              onPlayPause={handlePlayPauseControl}
              onShare={() => {}}
              onInfo={() => {}}
              onBack={handleBackControl}
              onNext={handleNextControl}
              onMute={() => setIsMuted((prev) => !prev)}
              isMuted={isMuted}
              currentMode={modeValue}
              variant="large"
              channels={channels}
              currentChannel={currentChannel}
              setCurrentChannel={setCurrentChannel}
              view3d={view3d}
              setView3d={setView3d}
            />
            <div className="left-footer">
              <div className="made-in">
                <div>Made For Gaurav</div>
                <div className="scan-qr">Scan QR for more info.</div>
              </div>
              <div className="time-title">
                <div>
                  {new Date().toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: false,
                  })}
                </div>
                <div className="time-title-title">GAU</div>
              </div>
              <div className="qr">
                <img id="qr-id"></img>
              </div>
              <div className="logo"></div>
            </div>
          </div>
        </div>

        {/* Left section toggle (mirrors right) */}
        <div
          className={`left-section-toggle ${
            leftSectionVisible ? "pos-visible" : "pos-hidden"
          }`}
          onClick={() => setLeftSectionVisible(!leftSectionVisible)}
        >
          <div className="toggle-arrow">
            {leftSectionVisible ? (
              <LeftArrowSVG currentMode={modeValue} />
            ) : (
              <RightArrowSVG currentMode={modeValue} />
            )}
          </div>
          <div
            className={`toggle-line ${
              modeValue === 1 ? "mode-dark" : "mode-light"
            }`}
          />
        </div>

        {/* Toggle button for right section */}
        <div
          className={`right-section-toggle ${
            rightSectionVisible ? "pos-visible-right" : "pos-hidden-right"
          }`}
          onClick={() => setRightSectionVisible(!rightSectionVisible)}
        >
          <div
            className={`toggle-arrow ${
              rightSectionVisible ? "bounce-right" : "bounce-left"
            }`}
          >
            {rightSectionVisible ? (
              <RightArrowSVG currentMode={modeValue} />
            ) : (
              <LeftArrowSVG currentMode={modeValue} />
            )}
          </div>
          <div
            className={`toggle-line ${
              modeValue === 1 ? "mode-dark" : "mode-light"
            }`}
          />
        </div>

        <div
          className={`right-section ${
            rightSectionVisible ? "visible" : "hidden"
          }`}
        >
          <div className={`recruiter-section ${recruiterTypingOut ? "recruiter-section-typing-out" : ""}`}>
            <div className="right-horizontal-row"></div>
            <div className="recruiter-heading">
              <div className="recruiter-heading-icon">
                <RecruiterPanelIcon />
              </div>
              <div className="recruiter-heading-copy" key={`recruiter-head-${recruiterDisplayChannel}`}>
                <div className="recruiter-heading-title">{recruiterPanel.title}</div>
                <div className="recruiter-heading-subtitle">{recruiterPanel.subtitle}</div>
              </div>
            </div>
            <div className={`recruiter-body ${recruiterFadingOut ? "recruiter-body-fading" : ""}`}>
              <RecruiterPanel
                key={`recruiter-panel-${recruiterDisplayChannel}`}
                channel={recruiterDisplayChannel}
              />
            </div>
          </div>
        </div>
        <div
          className={`three_env_container ${
            view3d ? "three_env_visible" : "three_env_hidden"
          }`}
        >
          {view3d && (
            <ThreeEnv
              channel={currentChannel}
              currentMode={currentMode}
              windEnabled={windEnabled}
              ambientMuted={isMuted}
              resetFocusSignal={homeResetSignal}
              onTvFocusChange={(isFocused) => {
                if (!view3d) return;
                setLeftSectionVisible(!isFocused);
                setRightSectionVisible(!isFocused);
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}

function generateQrCode(url, color) {
  QRCode.toDataURL(url, { color: { dark: color, light: "#0000" } })
    .then((url) => {
      document.getElementById("qr-id").src = url;
    })
    .catch((err) => {
      console.error(err);
    });
}

function PowerIcon() {
  return (
    <svg
      className="power-icon"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      role="img"
      aria-label="power"
    >
      <path
        d="M12 3v8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M7.2 5.9A8 8 0 1 0 16.8 5.9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LeftArrowSVG({ currentMode }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 18L9 12L15 6"
        stroke={currentMode === 1 ? "#dec0f7" : "#0030ff"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RightArrowSVG({ currentMode }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 18L15 12L9 6"
        stroke={currentMode === 1 ? "#dec0f7" : "#0030ff"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
