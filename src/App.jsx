// import "./App.css";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

// Import extracted components
import { MediumBody } from "./components/Medium/MediumBody";
import { LargeBody } from "./components/Large/LargeBody";
import Loading from "./components/Loading/Loading";

function App() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    console.log(projects);
  }, [projects]);
  return (
    <>
      <Body projects={projects} />
    </>
  );
}

export default App;

function Body({ projects }) {
  const [loading, setLoading] = useState(true);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [firstSceneReady, setFirstSceneReady] = useState(false);
  const [currentProject, setCurrentProject] = useState(0);
  const [isPlaying, setisPlaying] = useState(false);
  const [currentMode, setCurrentMode] = useState(0);
  const [view3d, setView3d] = useState(true);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 998);
  const [useCrtVideo, setUseCrtVideo] = useState(true);

  const handleFirstSceneReady = () => {
    if (firstSceneReady) return;
    setFirstSceneReady(true);
    setLoading(false);
    setLoadingComplete(true);
  };

  useEffect(() => {
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsLargeScreen(window.innerWidth > 998);
      }, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    // const updateStylesheet = async () => {
    //   // let stylesheet;
    //   // if (currentMode) {
    //   //   stylesheet = await import("./AppDark.css");
    //   // } else {
    //   //   stylesheet = await import("./App.css");
    //   // }
    //   // console.log(stylesheet);

    //   const existingLinkElement = document.querySelector("#dynamic-stylesheet");
    //   if (existingLinkElement) {
    //     document.head.removeChild(existingLinkElement);
    //   }

    //   const linkElement = document.createElement("link");
    //   linkElement.id = "dynamic-stylesheet";
    //   linkElement.rel = "stylesheet";
    //   if (currentMode) linkElement.href = "./AppDark.css";
    //   else linkElement.href = "./App.css";
    //   // linkElement.href = stylesheet.default;
    //   document.head.appendChild(linkElement);
    // };

    // updateStylesheet();

    // const existingLinkElement = document.querySelector("#dynamic-stylesheet");
    // if (existingLinkElement) {
    //   document.head.removeChild(existingLinkElement);
    // }

    const dynamicStyle = document.querySelector("#dynamic-stylesheet");
    if (!(dynamicStyle instanceof HTMLLinkElement)) return;

    const nextHref = currentMode ? "./src/Appdark.css" : "./src/App.css";
    if (dynamicStyle.getAttribute("href") !== nextHref) {
      dynamicStyle.setAttribute("href", nextHref);
    }
  }, [currentMode]);

  return (
    <>
      <div className="body-container">
        {isLargeScreen ? (
          <LargeBody
            projects={projects}
            currentProject={currentProject}
            setCurrentProject={setCurrentProject}
            isPlaying={isPlaying}
            setisPlaying={setisPlaying}
            currentMode={currentMode}
            setCurrentMode={setCurrentMode}
            loadingComplete={loadingComplete}
            onInitialSceneReady={handleFirstSceneReady}
          />
        ) : (
          <MediumBody
            projects={projects}
            currentProject={currentProject}
            setCurrentProject={setCurrentProject}
            currentMode={currentMode}
            setCurrentMode={setCurrentMode}
            isPlaying={isPlaying}
            setisPlaying={setisPlaying}
            view3d={view3d}
            setView3d={setView3d}
            onInitialSceneReady={handleFirstSceneReady}
          />
        )}
      </div>
      {loading ? <Loading /> : null}
      <div className="crt-overlay" aria-hidden="true">
        {useCrtVideo && (
          <video
            className="crt-overlay-video"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            onError={() => setUseCrtVideo(false)}
          >
            <source src="/crt-overlay.webm" type="video/webm" />
            <source src="/crt-overlay.mp4" type="video/mp4" />
          </video>
        )}
        <div className="crt-overlay-frame"></div>
        <div className="crt-overlay-scanlines-lite"></div>
        {!useCrtVideo && <div className="crt-overlay-noise-lite"></div>}
      </div>
    </>
  );
}

Body.propTypes = {
  projects: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
};
