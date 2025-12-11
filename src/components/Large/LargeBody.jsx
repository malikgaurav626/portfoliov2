import { useEffect, useState } from "react";
import { addComment } from "../../firebase/addcomment";
import QRCode from "qrcode";
import { CommentList } from "../Comments/CommentList";
import { CommentInput } from "../Comments/CommentInput";
import { Footer } from "../Footer/Footer";
import { ControlBar } from "../ControlBar/ControlBar";

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
  const [view3d, setView3d] = useState(false);
  const channels = ["CHANNEL 1 / SAKURA", "CHANNEL 2 / DUNNO"];

  // Animate sections in after loading is complete
  useEffect(() => {
    if (loadingComplete) {
      setLeftSectionVisible(true);
      setRightSectionVisible(true);
    }
  }, [loadingComplete]);

  function handleImmerseClick() {
    // Collapse both sections; future enhancements can be added here
    setLeftSectionVisible(false);
    setRightSectionVisible(false);
  }

  function handleDialClick(event) {
    const projectCount = Object.keys(projects).length;
    if (projectCount === 0) return;

    let dial = document.getElementsByClassName("dial")[0];
    dial.style.transition = "transform 0.5s";
    let frequency = document.getElementsByClassName("frequency")[0];
    frequency.style.transition = "transform 0.5s";
    frequency.innerHTML = `${Math.round(
      ((currentProject + 1) / projectCount) * 89 + 10
    )} KHZ`;
    dial.style.transform = `rotate(${
      ((currentProject + 1) / projectCount) * 360
    }deg)`;

    setCurrentProject((currentProject + 1) % projectCount);
  }

  function resetDial() {
    const projectCount = Object.keys(projects).length;
    if (projectCount === 0) return;

    let dial = document.getElementsByClassName("dial")[0];
    dial.style.transition = "transform 0.5s";
    let frequency = document.getElementsByClassName("frequency")[0];
    frequency.style.transition = "transform 0.5s";
    frequency.innerHTML = `${Math.round((0 / projectCount) * 89 + 10)} KHZ`;
    dial.style.transform = `rotate(${(0 / projectCount) * 360}deg)`;
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

  useEffect(() => {
    generateQrCode("https://www.linkedin.com/in/malikgaurav626/", "#0030ff");
  }, []);

  return (
    <>
      <div className="container">
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
                resetDial();
              }}
            >
              <span id="home-title-id">HOME</span>{" "}
              <img src="/power.png" alt="power" id="power-img-id"></img>
            </div>
            <div className="horizontal-row"></div>
            <div className="circular-dial-container">
              <div className="signal">SIGNAL</div>
              <div className="dial" onClick={handleDialClick}>
                <div className="dialer"></div>
              </div>
              <div className="frequency">10 KHZ</div>
            </div>
            <div className="horizontal-row"></div>
          </div>

          <div className="brightness-mode">
            <div className="brightness-title">DARK MODE</div>
            <div className="mode-toggle-container">
              <div
                className={"toggle-btn " + (currentMode == 1 && "active-btn")}
                onClick={() => setCurrentMode(1)}
              ></div>
              <div
                className={"toggle-btn " + (currentMode == 0 && "active-btn")}
                onClick={() => setCurrentMode(0)}
              ></div>
            </div>
            <div className="btn-container">
              <div
                className={
                  "psuedo-btn " + (currentMode == 1 && "active-psuedo-btn")
                }
                onClick={() => setCurrentMode(1)}
              >
                ON
              </div>
              <div
                className={
                  "psuedo-btn " + (currentMode == 0 && "active-psuedo-btn")
                }
                onClick={() => setCurrentMode(0)}
              >
                OFF
              </div>
            </div>
          </div>

          <div className="left-footer-wrapper">
            <ControlBar
              isPlaying={isPlaying}
              setisPlaying={setisPlaying}
              onShare={() => {}}
              onInfo={() => {}}
              onBack={() =>
                setCurrentProject(
                  (currentProject - 1 + Object.keys(projects).length) %
                    Object.keys(projects).length
                )
              }
              onNext={() =>
                setCurrentProject(
                  (currentProject + 1) % Object.keys(projects).length
                )
              }
              onMute={() => {}}
              isMuted={false}
              currentMode={currentMode}
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
              <LeftArrowSVG currentMode={currentMode} />
            ) : (
              <RightArrowSVG currentMode={currentMode} />
            )}
          </div>
          <div
            className={`toggle-line ${
              currentMode === 1 ? "mode-dark" : "mode-light"
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
              <RightArrowSVG currentMode={currentMode} />
            ) : (
              <LeftArrowSVG currentMode={currentMode} />
            )}
          </div>
          <div
            className={`toggle-line ${
              currentMode === 1 ? "mode-dark" : "mode-light"
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
              {currentMode == 1 ? <SVG1 /> : <SVG2 />}
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
        {/* Immerse button centered at bottom, conditionally slid in/out */}
        <div
          className={`immerse-btn ${
            leftSectionVisible || rightSectionVisible
              ? "immerse-visible"
              : "immerse-hidden"
          }`}
          onClick={handleImmerseClick}
        >
          IMMERSE
        </div>
        <div className="three_env_container">{/* <ThreeEnv /> */}</div>
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
