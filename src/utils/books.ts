import { FDB } from "../config/firebase.ts";
import { ref, set, get, update, remove, push, query, limitToLast, orderByKey } from "firebase/database";

// Define Book Type
interface Book {
  name: string;
  author: string;
  description:string;
  SPN_NO: string;
  quantity: number;
}

// export const createBook = async (book: Book) => {
//   try {
//     const booksRef = ref(FDB, "books"); // Reference to the books collection
//     const newBookRef = push(booksRef); // Generate a unique Firebase key

//     // Save the book data to Firebase
//     await set(newBookRef, book);

//     return { success: true, message: "Book added successfully!", bookId: newBookRef.key };
//   } catch (error) {
//     console.error("Create Book Error:", error);
//     throw error;
//   }
// };

export const createBook = async (book: Book) => {
  try {
    const booksRef = ref(FDB, "books"); // Reference to the books collection
    const newBookRef = push(booksRef);  // Generate a unique Firebase key

    // Save the book data to Firebase
    await set(newBookRef, book);

    // Create a reminder for the new book added
    const reminderMessage = `New book added: ${book.name} by ${book.author}`;
    await createReminder(reminderMessage);

    return { success: true, message: "Book added successfully!", bookId: newBookRef.key };
  } catch (error) {
    console.error("Create Book Error:", error);
    throw error;
  }
};

// ** Retrieve All Books (With IDs) **
export const getAllBooks = async () => {
  try {
    const booksRef = ref(FDB, "books");
    const snapshot = await get(booksRef);

    if (snapshot.exists()) {
      const books: Book[] = [];
      snapshot.forEach((childSnapshot) => {
        const book = childSnapshot.val();
        book.id = childSnapshot.key; // Add the auto-generated key as the ID
        books.push(book);
      });
      return books;
    } else {
      console.log("No books found.");
      return [];
    }
  } catch (error) {
    console.error("Get All Books Error:", error);
    throw error;
  }
};

// ** Update a Book **
export const updateBook = async (bookId: string, newData: Partial<Omit<Book, "id">>) => {
  try {
    const bookRef = ref(FDB, `books/${bookId}`);

    await update(bookRef, newData);

    return { success: true, message: "Book updated successfully!", bookId };
  } catch (error) {
    console.error("Update Book Error: ", error);
    throw error;
  }
};

// ** Delete a Book **
export const deleteBook = async (bookId: string) => {
  try {
    const bookRef = ref(FDB, `books/${bookId}`);
    await remove(bookRef);

    return { success: true, message: "Book deleted successfully!" };
  } catch (error) {
    console.error("Delete Book Error: ", error);
    throw error;
  }
};


//get a book
export const getaBook = async (bookId: string) => {
  try {
    const bookRef = ref(FDB, `books/${bookId}`);
    const snapshot = await get(bookRef);

    if(snapshot.exists()){
      return snapshot.val();
    }else{
      return null
    }
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
};



export const getLatestBooks = async () => {
  try {
    const booksRef = ref(FDB, "books");

    // Query for the latest 3 books added, sorted by Firebase generated keys (created time)
    const latestBooksQuery = query(booksRef, orderByKey(), limitToLast(3));

    const snapshot = await get(latestBooksQuery);

    if (snapshot.exists()) {
      const books: Book[] = [];
      snapshot.forEach((childSnapshot) => {
        const book = childSnapshot.val();
        book.id = childSnapshot.key; // Add the auto-generated key as the ID
        books.push(book);
      });
      return books.reverse(); // Reverse to show most recent first
    } else {
      console.log("No books found.");
      return [];
    }
  } catch (error) {
    console.error("Get Latest Books Error:", error);
    throw error;
  }
};


interface Reminder {
  message: string;      
  createdTime: string;   
}

export const createReminder = async (message: string) => {
  try {
    const remindersRef = ref(FDB, "reminders"); 
    const newReminderRef = push(remindersRef);

    // Save the reminder data to Firebase
    const reminder: Reminder = {
      message,
      createdTime: new Date().toISOString(),
    };

    await set(newReminderRef, reminder);

    return { success: true, message: "Reminder created successfully!", reminderId: newReminderRef.key };
  } catch (error) {
    console.error("Create Reminder Error:", error);
    throw error;
  }
};

export const getAllReminders = async () => {
  try {
    const remindersRef = ref(FDB, "reminders");
    const snapshot = await get(remindersRef);

    if (snapshot.exists()) {
      const reminders: Reminder[] = [];
      snapshot.forEach((childSnapshot) => {
        const reminder = childSnapshot.val();
        reminder.id = childSnapshot.key; // Add the auto-generated key as the ID
        reminders.push(reminder);
      });
      return reminders;
    } else {
      console.log("No reminders found.");
      return [];
    }
  } catch (error) {
    console.error("Get All Reminders Error:", error);
    throw error;
  }
};

export const getMonthlyReminders = async () => {
  try {
    const remindersRef = ref(FDB, "reminders");
    const snapshot = await get(remindersRef);

    if (snapshot.exists()) {
      let monthlyReminders: Reminder[] = [];
      const currentMonth = new Date().getMonth();  // Get current month (0-indexed)
      const currentYear = new Date().getFullYear(); // Get current year

      snapshot.forEach((childSnapshot) => {
        const reminder = childSnapshot.val();
        const reminderDate = new Date(reminder.createdTime);
        const reminderMonth = reminderDate.getMonth();
        const reminderYear = reminderDate.getFullYear();

        // Check if the reminder is from the current month and year
        if (reminderMonth === currentMonth && reminderYear === currentYear) {
          monthlyReminders.push(reminder);
        }
      });

      return monthlyReminders;
    } else {
      console.log("No reminders found.");
      return [];
    }
  } catch (error) {
    console.error("Get Monthly Reminders Error:", error);
    throw error;
  }
};
