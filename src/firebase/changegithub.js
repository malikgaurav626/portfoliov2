import {
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase";

let inDebounce;

export const addGithub = async (project_id) => {
  clearTimeout(inDebounce);

  inDebounce = setTimeout(async () => {
    try {
      // Validate input
      if (!project_id) {
        console.error("Project ID is required");
        return;
      }

      const projectsRef = collection(db, "projects");
      const q = query(projectsRef, where("id", "==", Number(1)));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.error(`Project with ID ${project_id} does not exist.`);
        return;
      }

      const projectDoc = querySnapshot.docs[0];

      const newGithub = true;

      await updateDoc(projectDoc.ref, {
        github: newGithub,
      });

      console.log(`github successfully added to project with ID ${project_id}`);
    } catch (error) {
      console.error("Error updating github status:", error);

      // Handle specific Firebase errors
      if (error.code === "permission-denied") {
        console.error("Permission denied. Check Firestore security rules.");
      } else if (error.code === "unavailable") {
        console.error(
          "Firestore service is currently unavailable. Please try again later."
        );
      } else if (error.code === "not-found") {
        console.error("The requested document was not found.");
      } else {
        console.error(
          "An unexpected error occurred while updating github status."
        );
      }
    }
  }, 1000);
};
