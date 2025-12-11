import { useState, useEffect } from "react";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";

/**
 * Custom hook to fetch and subscribe to projects from Firestore
 * @returns {Array} - Array of projects
 */
export function useProjects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const projectsCollection = collection(db, "projects");
      const projectSnapshot = await getDocs(projectsCollection);
      const projectList = projectSnapshot.docs.map((doc) => doc.data());
      // sort projectList items with id
      const sortedProjectList = projectList.sort((a, b) => a.id - b.id);
      setProjects(sortedProjectList);
    };

    const unsubscribe = onSnapshot(collection(db, "projects"), () => {
      fetchProjects();
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  return projects;
}
