import { useEffect, useRef, useState } from "react";
import { addComment } from "../../firebase/addcomment";
import QRCode from "qrcode";
import { CommentList } from "../Comments/CommentList";
import { CommentInput } from "../Comments/CommentInput";
import { Footer } from "../Footer/Footer";
import { ControlBar } from "../ControlBar/ControlBar";
import { ThreeEnv } from "../ThreeEnv/ThreeEnv";
import { ConstellationPanel } from "../Constellation/ConstellationPanel";
import { SignalMonitor } from "../Signal/SignalMonitor";

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
  const [view3d, setView3d] = useState(true);
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

  function handleCommentSubmit(event) {
    let comment = event.target.value;
    let user = "anonymous";
    let project_id = currentProject;

    const match = comment.match(/^@.*?_/);
    if (match) {
      user = match[0].slice(1, -1);
      comment = comment.replace(match[0], "").trim();
    }

    addComment(user, comment, project_id);
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

  const modeValue = currentMode;
  const controlPlayState = view3d ? windEnabled : isPlaying;
  const modeTitle = "DISPLAY MODE";
  const leftModeLabel = "DARK";
  const rightModeLabel = "LIGHT";
  const sceneTime = "night";

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
              onClick={() => {
                setCurrentProject(0);
              }}
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
          <div className="comments">
            <div className="right-horizontal-row"></div>
            <div className="comments-heading">
              {modeValue == 1 ? <SVG1 /> : <SVG2 />}
              <div className="comment-title">COMMENTS</div>
            </div>
            <div className="comments-body">
              <CommentList
                comments={projects[currentProject]?.comments}
                currentProject={currentProject}
              />
            </div>
            <CommentInput onSubmit={handleCommentSubmit} />
          </div>
          <Footer />
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

function SVG1() {
  return (
    <>
      <svg
        width="30"
        height="18"
        viewBox="0 0 30 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M13.627 14.341 13.33 14H7.5a6.5 6.5 0 1 1 0-13h15a6.5 6.5 0 1 1 0 13h-4.829l-.299.341-1.872 2.14-1.873-2.14ZM15.5 18l.664-.76L18.125 15H22.5a7.5 7.5 0 0 0 0-15h-15a7.5 7.5 0 1 0 0 15h5.375l1.96 2.24.665.76Zm-5-9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM14 7.5a1.5 1.5 0 1 0 3 0h-3ZM20.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
          fill="#F2D4F2"
        ></path>
      </svg>
    </>
  );
}

function SVG2() {
  return (
    <>
      <svg
        width="30"
        height="18"
        viewBox="0 0 30 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M13.627 14.341 13.33 14H7.5a6.5 6.5 0 1 1 0-13h15a6.5 6.5 0 1 1 0 13h-4.829l-.299.341-1.872 2.14-1.873-2.14ZM15.5 18l.664-.76L18.125 15H22.5a7.5 7.5 0 0 0 0-15h-15a7.5 7.5 0 1 0 0 15h5.375l1.96 2.24.665.76Zm-5-9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM14 7.5a1.5 1.5 0 1 0 3 0h-3ZM20.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
          fill="#0E3DFF"
        ></path>
      </svg>
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

