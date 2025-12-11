// import "./App.css";
import { useEffect, useState } from "react";
import { db } from "./firebase/firebase";
import { collection, getDocs, onSnapshot } from "firebase/firestore";

// Import extracted components
import { MediumBody } from "./components/Medium/MediumBody";
import { LargeBody } from "./components/Large/LargeBody";
import Loading from "./components/Loading/Loading";

function App() {
  const [projects, setProjects] = useState([]);
  // useEffect(() => {
  //   const fetchProjects = async () => {
  //     const projectsCollection = collection(db, "projects");
  //     const projectSnapshot = await getDocs(projectsCollection);
  //     const projectList = projectSnapshot.docs.map((doc) => doc.data());
  //     // sort projectList items with id
  //     const sortedProjectList = projectList.sort((a, b) => a.id - b.id);
  //     setProjects(sortedProjectList);
  //   };

  //   const unsubscribe = onSnapshot(collection(db, "projects"), () => {
  //     fetchProjects();
  //   });

  //   // Clean up subscription on unmount
  //   return () => unsubscribe();
  // }, []);
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
  const [currentProject, setCurrentProject] = useState(0);
  const [isPlaying, setisPlaying] = useState(false);
  const [currentMode, setCurrentMode] = useState(0);
  const [view3d, setView3d] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 998);

  // Simulate loading completion after 2 seconds (replace with actual loading logic)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setLoadingComplete(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

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
    if (currentMode) dynamicStyle.href = "./src/AppDark.css";
    else dynamicStyle.href = "./src/App.css";
  }, [currentMode]);

  if (loading) {
    return <Loading />;
  }

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
          />
        )}
      </div>
    </>
  );
}
