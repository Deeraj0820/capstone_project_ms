import { FDB } from "../config/firebase.ts";
import { ref, get } from "firebase/database";

// Function to get the count of users, books, and bookings
export const getCounts = async () => {
  try {
    // Reference to the users, books, and bookings collections
    const usersRef = ref(FDB, "users");
    const booksRef = ref(FDB, "books");
    const bookingsRef = ref(FDB, "bookings");

    // Get the data for users, books, and bookings
    const [usersSnapshot, booksSnapshot, bookingsSnapshot] = await Promise.all([
      get(usersRef),
      get(booksRef),
      get(bookingsRef),
    ]);

    // Get the count for each collection
    const usersCount = usersSnapshot.exists() ? Object.keys(usersSnapshot.val()).length : 0;
    const booksCount = booksSnapshot.exists() ? Object.keys(booksSnapshot.val()).length : 0;
    const bookingsCount = bookingsSnapshot.exists() ? Object.keys(bookingsSnapshot.val()).length : 0;

    // Return the counts as an object
    return {
      usersCount,
      booksCount,
      bookingsCount,
    };
  } catch (error) {
    console.error("Error fetching counts:", error);
    throw error;
  }
};
