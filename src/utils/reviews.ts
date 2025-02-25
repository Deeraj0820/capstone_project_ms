import { ref, set, push, get, update, remove } from "firebase/database";
import { FDB } from "../config/firebase.ts"; // Assuming you already have your Firebase configuration

interface Review {
  bookId: string;
  userName: string;
  reviewText: string;
  timestamp: number; // Using a timestamp for the review
}

// ** Create a New Review **
export const createReview = async (review: Review) => {
  try {
    const reviewsRef = ref(FDB, "reviews");
    const newReviewRef = push(reviewsRef);
    await set(newReviewRef, review);

    return { success: true, message: "Review added successfully!", reviewId: newReviewRef.key };
  } catch (error) {
    console.error("Create Review Error:", error);
    throw error;
  }
};

// ** Get Reviews for a Specific Book **
export const getReviewsByBook = async (bookId: string) => {
  try {
    const reviewsRef = ref(FDB, "reviews");
    const snapshot = await get(reviewsRef);

    if (snapshot.exists()) {
      const reviews: Review[] = [];

      snapshot.forEach((childSnapshot) => {
        const review = childSnapshot.val();
        review.id = childSnapshot.key;

        // Filter reviews by bookId
        if (review.bookId === bookId) {
          reviews.push(review);
        }
      });

      return reviews.sort((a, b) => b.timestamp - a.timestamp); // Sort reviews by timestamp (latest first)
    } else {
      console.log("No reviews found for this book.");
      return [];
    }
  } catch (error) {
    console.error("Get Reviews Error:", error);
    throw error;
  }
};

// ** Update Review **
export const updateReview = async (reviewId: string, reviewText: string) => {
  try {
    const reviewRef = ref(FDB, `reviews/${reviewId}`);
    await update(reviewRef, { reviewText });

    return { success: true, message: "Review updated successfully!", reviewId };
  } catch (error) {
    console.error("Update Review Error:", error);
    throw error;
  }
};

// ** Delete Review **
export const deleteReview = async (reviewId: string) => {
  try {
    const reviewRef = ref(FDB, `reviews/${reviewId}`);
    await remove(reviewRef);

    return { success: true, message: "Review deleted successfully!" };
  } catch (error) {
    console.error("Delete Review Error:", error);
    throw error;
  }
};
