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

export const addComment = async (
  user = "anonymous",
  commentText,
  project_id
) => {
  clearTimeout(inDebounce);

  inDebounce = setTimeout(async () => {
    try {
      // Validate inputs
      if (!commentText || commentText.trim() === "") {
        console.error("Comment text cannot be empty");
        return;
      }

      if (!project_id) {
        console.error("Project ID is required");
        return;
      }

      const projectsRef = collection(db, "projects");
      const q = query(projectsRef, where("id", "==", Number(project_id)));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.error(`Project with ID ${project_id} does not exist.`);
        return;
      }

      const projectDoc = querySnapshot.docs[0];
      const projectData = projectDoc.data();

      if (!projectData.comments || !Array.isArray(projectData.comments)) {
        console.error("Invalid comments structure in project data");
        return;
      }

      const newComment = {
        id: projectData.comments.length.toString(),
        user: user + "-" + projectData.comments.length.toString(),
        text: commentText.trim(),
        date: new Date().toISOString(),
        project_id: String(project_id),
      };

      await updateDoc(projectDoc.ref, {
        comments: arrayUnion(newComment),
      });

      console.log(
        `Comment successfully added to project with ID ${project_id}`
      );
    } catch (error) {
      console.error("Error adding comment:", error);

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
        console.error("An unexpected error occurred while adding the comment.");
      }
    }
  }, 1000);
};
