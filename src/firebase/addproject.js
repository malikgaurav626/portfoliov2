import { collection, doc, writeBatch } from "firebase/firestore";
import { db } from "./firebase.js";

// Define your 13 projects
const projects = [
  {
    id: 0,
    type: "professional",
    name: "Forex Dominant",
    description:
      "Forex dominant, we have the true answer to the single question that every forex trader is asking, that is; what works? get in.",
    videoLink: "https://youtu.be/aXiEwjqWwQY?si=NoeZ6xZ_uZ9j39mU",
    imageLink: "https://i.ibb.co/80KsV8B/project-0-image.png",
    weblink: "https://forexdominant.com",
    githubLink: "",
    date: "05-11-2023",
    tech: ["html", "css", "javascript", "bootstrap", "wordpress"],
    status: "completed",
    live: true,
    github: false,
    developers: ["Gaurav"],
    client: "Forex Dominant",
    comments: [
      {
        id: "0",
        user: "anonymous",
        text: "Hello world!",
        date: "2015-01-01T00:00:00.000Z",
        project_id: "0",
      },
    ],
  },
  {
    id: 1,
    type: "professional",
    name: "Professor Portfolio",
    description: "A portfolio for a professor at IIIT Sonipat, India.",
    videoLink: "https://youtu.be/zMtGXbRUWsw?si=dyadIntYuVNJXCHy",
    imageLink: "https://i.ibb.co/6bBYvkj/project-1-image.png",
    weblink: "",
    githubLink: "https://github.com/malikgaurav626/Website-Wrapper",
    date: "30-12-2023",
    tech: ["html", "css", "javascript", "animejs", "lottiejs"],
    status: "completed",
    live: false,
    github: false,
    developers: ["Gaurav", "Shailen"],
    client: "Professor",
    comments: [
      {
        id: "0",
        user: "anonymous",
        text: "Hello wordsfdsld!",
        date: "2015-01-01T00:00:00.000Z",
        project_id: "1",
      },
    ],
  },
  {
    id: 2,
    type: "personal",
    name: "Cosmic Route",
    description:
      "Cosmic Route is a stunning 3D web application that takes you on a journey through our solar system. Explore the planets and even the dwarf planet Pluto with detailed information and a captivating visual experience.",
    videoLink: "https://youtu.be/42NsYiAcH_c?si=u25Vafe6y86i1ODT",
    imageLink: "https://i.ibb.co/fxFPTx0/project-2-image.png",
    weblink: "https://cosmicroute.netlify.app/",
    githubLink: "https://github.com/malikgaurav626/cosmicRoute",
    date: "15-10-2023",
    tech: ["html", "css", "javascript", "threejs", "animejs", "vite"],
    status: "completed",
    live: true,
    github: true,
    developers: ["Gaurav"],
    client: "Personal",
    comments: [
      {
        id: "0",
        user: "anonymous",
        text: "Hello world!",
        date: "2015-01-01T00:00:00.000Z",
        project_id: "2",
      },
    ],
  },
  {
    id: 3,
    type: "personal",
    name: "Game Ether",
    description:
      "Game Ether allows you to explore, discover, search, and stay up-to-date with the latest news about your favorite games.",
    videoLink: "https://youtu.be/wfUHmm8GOVw?si=0GLkbNVLZFVSjpNP",
    imageLink: "https://i.ibb.co/ZmD0Vym/project-3-image.png",
    weblink: "https://gameether.netlify.app/",
    githubLink: "https://github.com/malikgaurav626/gameether",
    date: "29-08-2023",
    tech: [
      "html",
      "css",
      "javascript",
      "reactjs",
      "redux",
      "vite",
      "IGDB API",
      "Azure News API",
      "kute.js",
      "anime.js",
    ],
    status: "completed",
    live: true,
    github: true,
    developers: ["Gaurav"],
    client: "Personal",
    comments: [
      {
        id: "0",
        user: "anonymous",
        text: "Hello wordsfdsld!",
        date: "2015-01-01T00:00:00.000Z",
        project_id: "3",
      },
    ],
  },
  {
    id: 4,
    type: "personal",
    name: "Exo Archives",
    description: "An online Nasa Exoplanets Archives explorer GUI.",
    videoLink: "https://youtu.be/EvDRxKRZ1YY?si=Y2d_rqAtvuZ92x8b",
    imageLink: "https://i.ibb.co/19RXrXf/project-4-image.png",
    weblink: "https://exoarchives.netlify.app",
    githubLink: "https://github.com/malikgaurav626/ExoArchives",
    date: "15-09-2023",
    tech: ["html", "css", "javascript", "reactjs", "redux", "vite"],
    status: "completed",
    live: true,
    github: true,
    developers: ["Gaurav"],
    client: "Personal",
    comments: [
      {
        id: "0",
        user: "anonymous",
        text: "Hello world!",
        date: "2015-01-01T00:00:00.000Z",
        project_id: "4",
      },
    ],
  },
  {
    id: 5,
    type: "personal",
    name: "Neo Notes",
    description:
      "NeoNotes is a captivating note-taking application that combines a mesmerizing 70s-style vaporwave aesthetic with modern functionality.",
    videoLink: "https://youtu.be/5199kTz8leM?si=fIinwxMBeFYqhEKA",
    imageLink: "https://i.ibb.co/x6snFdz/project-5-image.png",
    weblink: "https://neonotes101.netlify.app",
    githubLink: "https://github.com/malikgaurav626/neonotes",
    date: "20-09-2023",
    tech: [
      "html",
      "css",
      "javascript",
      "reactjs",
      "redux",
      "vite",
      "google firebase API",
      "google authentication API",
    ],
    status: "completed",
    live: true,
    github: true,
    developers: ["Gaurav"],
    client: "Personal",
    comments: [
      {
        id: "0",
        user: "anonymous",
        text: "Hello wordsfdsld!",
        date: "2015-01-01T00:00:00.000Z",
        project_id: "5",
      },
    ],
  },
  {
    id: 6,
    type: "personal",
    name: "Flux",
    description:
      " Flux is a captivating music web player that seamlessly integrates with the Spotify API.",
    videoLink: "https://youtu.be/w3LLF7Kjdj0?si=vMouS4-Xpwmzrw0Q",
    imageLink: "https://i.ibb.co/L101fs6/project-6-image.png",
    weblink: "https://fluxplayer.netlify.app/",
    githubLink: "https://github.com/malikgaurav626/Flux",
    date: "28-06-2023",
    tech: [
      "html",
      "css",
      "javascript",
      "reactjs",
      "redux",
      "vite",
      "spotify API",
      "react-spotify-web-playback",
      "anime.js",
      "wavesurfer.js",
    ],
    status: "completed",
    live: true,
    github: true,
    developers: ["Gaurav"],
    client: "Personal",
    comments: [
      {
        id: "0",
        user: "anonymous",
        text: "Hello world!",
        date: "2015-01-01T00:00:00.000Z",
        project_id: "6",
      },
    ],
  },
  {
    id: 7,
    type: "personal",
    name: "TraveLG",
    description:
      "TravelAdvisor is a beautiful, modern, and minimalist React app designed to help you discover and plan your next travel adventure.",
    videoLink: "https://youtu.be/BndmKbeNo4g?si=e9cnMxJahoLEXkKj",
    imageLink: "https://i.ibb.co/Y79MJG8/project-7-image.png",
    weblink: "https://travelg101.netlify.app/",
    githubLink: "https://github.com/malikgaurav626/traveladviser",
    date: "11-07-2023",
    tech: [
      "html",
      "css",
      "javascript",
      "reactjs",
      "redux",
      "vite",
      "google maps API",
      "google places API",
      "google geocoding API",
      "lodash",
      "rc-slider",
    ],
    status: "completed",
    live: true,
    github: true,
    developers: ["Gaurav"],
    client: "Personal",
    comments: [
      {
        id: "0",
        user: "anonymous",
        text: "Hello world!",
        date: "2015-01-01T00:00:00.000Z",
        project_id: "7",
      },
    ],
  },
  {
    id: 8,
    type: "personal",
    name: "Cyber run",
    description: "A 2D side scroller game using JavaScript.",
    videoLink: "https://youtu.be/U0xSS9prr3I?si=_Etri_6ica-QFT7g",
    imageLink: "https://i.ibb.co/rtyvZLg/project-8-image.png",
    weblink: "https://malikgaurav626.github.io/cybeRRun/",
    githubLink: "https://github.com/malikgaurav626/cybeRRun",
    date: "05-06-2023",
    tech: ["html", "css", "javascript"],
    status: "completed",
    live: true,
    github: true,
    developers: ["Gaurav"],
    client: "Personal",
    comments: [
      {
        id: "0",
        user: "anonymous",
        text: "Hello world!",
        date: "2015-01-01T00:00:00.000Z",
        project_id: "8",
      },
    ],
  },
  {
    id: 9,
    type: "personal",
    name: "Maze Generator",
    description:
      "A maze generator using JavaScript. Based on Prim's algorithm.",
    videoLink: "https://youtu.be/CC2FBUffgVM?si=GGZyJOZdHplEdXpI",
    imageLink: "https://i.ibb.co/L9CCDth/project-9-image.png",
    weblink: "https://malikgaurav626.github.io/mazeGenerator-PrimsAlgorithm/",
    githubLink:
      "https://github.com/malikgaurav626/mazeGenerator-PrimsAlgorithm",
    date: "23-05-2023",
    tech: ["html", "css", "javascript"],
    status: "completed",
    live: true,
    github: true,
    developers: ["Gaurav"],
    client: "Personal",
    comments: [
      {
        id: "0",
        user: "anonymous",
        text: "Hello world!",
        date: "2015-01-01T00:00:00.000Z",
        project_id: "9",
      },
    ],
  },
  {
    id: 10,
    type: "personal",
    name: "History Haryana",
    description:
      "Website for a thorough look at the history of state of Haryana in Indian Subcontinent (place where I spent my childhood).",
    videoLink: "https://youtu.be/NxWpZ71T2_0?si=x77Hj4YS-nLrAX0G",
    imageLink: "https://i.ibb.co/tCJ9mqd/project-10-image.png",
    weblink: "https://malikgaurav626.github.io/Project-HistoryHaryana/",
    githubLink: "https://github.com/malikgaurav626/Project-HistoryHaryana",
    date: "11-07-2022",
    tech: ["html", "css", "javascript", "bootstrap"],
    status: "completed",
    live: true,
    github: true,
    developers: ["Gaurav"],
    client: "Personal",
    comments: [
      {
        id: "0",
        user: "anonymous",
        text: "Hello world!",
        date: "2015-01-01T00:00:00.000Z",
        project_id: "10",
      },
    ],
  },
  {
    id: 11,
    type: "personal",
    name: "Image Classifier",
    description:
      "A image classifier model that classifies images b/w cats and dogs. and a web app to use the model. (can be used to classify suv and sedan cars as well)",
    videoLink: "",
    imageLink: "",
    weblink: "",
    githubLink: "",
    date: "11-07-2022",
    tech: ["html", "css", "javascript", "tensorflow", "python", "google colab"],
    status: "completed",
    live: false,
    github: false,
    developers: ["Gaurav"],
    client: "Personal",
    comments: [
      {
        id: "0",
        user: "anonymous",
        text: "Hello world!",
        date: "2015-01-01T00:00:00.000Z",
        project_id: "11",
      },
    ],
  },
  {
    id: 12,
    type: "personal",
    name: "Spice Universe",
    description: "A simple text-based action-adventure game in C++.",
    videoLink: "https://youtu.be/8iGVKPpAhuA?si=pEfyD1AwzKUeXnKQ",
    imageLink: "https://i.ibb.co/K7H2F5t/project-12-image.png",
    githubLink: "https://github.com/malikgaurav626/Project-SpiceUniverse",
    weblink: "",
    date: "11-04-2022",
    tech: ["c++"],
    status: "ongoing",
    live: false,
    github: true,
    developers: ["Gaurav"],
    client: "Personal",
    comments: [
      {
        id: "0",
        user: "anonymous",
        text: "Hello world!",
        date: "2015-01-01T00:00:00.000Z",
        project_id: "12",
      },
    ],
  },
  {
    id: 13,
    type: "personal",
    name: "The Grand Budapest Hotel",
    description: "A website for The Grand Budapest Hotel. (based on the movie)",
    videoLink: "https://youtu.be/nFdTwP73KyI?si=64ajqEwjrNCvpWVM",
    imageLink: "https://i.ibb.co/7t4xGmd/project-13-image.png",
    weblink:
      "https://malikgaurav626.github.io/The-Grand-Budapest-Hotel-fansite/",
    githubLink:
      "https://github.com/malikgaurav626/The-Grand-Budapest-Hotel-fansite",
    date: "11-07-2022",
    tech: ["html", "css", "javascript", "bootstrap"],
    status: "completed",
    live: true,
    github: true,
    developers: ["Gaurav"],
    client: "Personal",
    comments: [
      {
        id: "0",
        user: "anonymous",
        text: "Hello world!",
        date: "2015-01-01T00:00:00.000Z",
        project_id: "13",
      },
    ],
  },
  {
    id: 14,
    type: "personal",
    name: "NFD Clone",
    description:
      "A Website Clone of NFD, a company that provides services related to the crypto market.",
    videoLink: "https://youtu.be/7jDrj1GP49k?si=gBa0bIqLD8IemDbN",
    imageLink: "https://i.ibb.co/h21bZL6/Screenshot-2024-01-08-182327.png",
    weblink: "https://nfd101.netlify.app",
    githubLink: "https://github.com/malikgaurav626/NFD-Clone",
    date: "08-01-2024",
    tech: ["html", "css", "javascript", "bootstrap", "animejs", "react"],
    status: "completed",
    live: true,
    github: true,
    developers: ["Gaurav"],
    client: "Personal",
    comments: [
      {
        id: "0",
        user: "anonymous",
        text: "Hello world!",
        date: "2015-01-01T00:00:00.000Z",
        project_id: "0",
      },
    ],
  },
];

// Function to add projects to Firestore
async function addProjects() {
  try {
    const batch = writeBatch(db);

    projects.forEach((project) => {
      const docRef = doc(collection(db, "projects")); // auto-generate ID
      batch.set(docRef, project);
    });

    await batch.commit();
    console.log("All projects added successfully");
  } catch (error) {
    console.error("Error adding projects:", error);

    // Handle specific Firebase errors
    if (error.code === "permission-denied") {
      console.error("Permission denied. Check Firestore security rules.");
    } else if (error.code === "unavailable") {
      console.error(
        "Firestore service is currently unavailable. Please try again later."
      );
    } else if (error.code === "resource-exhausted") {
      console.error("Quota exceeded. Please check your Firebase usage.");
    } else {
      console.error("An unexpected error occurred while adding projects.");
    }
    throw error;
  }
}

// Call the function
export default addProjects;
