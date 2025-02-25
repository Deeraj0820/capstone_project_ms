import { FDB } from "../config/firebase.ts";
import { ref, set, get, update, remove, push,query, limitToLast, orderByKey } from "firebase/database";
import { getAllBooks, updateBook } from "./books.ts";

interface Booking {
  userId: string;
  userName: string;
  bookName: string;
  SPN_NO: string;
  author: string;
  dateOfIssue: string;
  price: string;
}

interface Notification {
  id?: string; // Auto-generated by Firebase
  bookName: string;
  SPN_NO: string;
  userName: string;
  timestamp: string; // ISO string or formatted date
  isRead?: boolean; 
}

// const currentUser = JSON.parse(localStorage.getItem("adminUser") || "{}");

export const createBooking = async (booking: Booking) => {
  try {
    const bookingsRef = ref(FDB, "bookings"); // Reference to the bookings collection
    const newBookingRef = push(bookingsRef); // Generate a unique Firebase key

    // Save the booking data to Firebase
    await set(newBookingRef, booking);

        // Create a notification for the booking
        const notification: Notification = {
          bookName: booking.bookName,
          SPN_NO: booking.SPN_NO,
          userName: booking.userName,
          isRead:false,
          timestamp: new Date().toISOString(),
        };
    
        await createNotification(notification);

    return { success: true, message: "Booking added successfully!", bookingId: newBookingRef.key };
  } catch (error) {
    console.error("Create Booking Error:", error);
    throw error;
  }
};

export const getAllBookings = async (currentUser) => {
  try {
    const bookingsRef = ref(FDB, "bookings");
    const snapshot = await get(bookingsRef);

    if (snapshot.exists()) {
      const bookings: (Booking & { id: string })[] = [];

      snapshot.forEach((childSnapshot) => {
        const booking = childSnapshot.val();
        booking.id = childSnapshot.key; 
        // Check if the user is an admin
        if (currentUser.isAdmin === true) {
          // console.log("User is an admin, showing all bookings.");
          bookings.push(booking); // If admin, show all bookings
        } else {
          // console.log("User is not an admin, filtering bookings.");

          // Check if the booking belongs to the user
          const isUserBooking =
            booking.userId === currentUser.id || // Check userId first
            booking.userName === currentUser.displayName; // Fallback to userName

          if (isUserBooking) {
            // console.log("Booking belongs to the user, adding to list.");
            bookings.push(booking);
          } else {
            // console.log("Booking does not belong to the user, skipping.");
          }
        }
      });

      // Debug log for filtered bookings
      console.log("Filtered Bookings:", bookings);
      return bookings;
    } else {
      console.log("No bookings found.");
      return [];
    }
  } catch (error) {
    console.error("Get All Bookings Error:", error);
    throw error;
  }
};

export const updateBooking = async (bookingId: string, newData: Partial<Booking>) => {
  try {
    const bookingRef = ref(FDB, `bookings/${bookingId}`);

    await update(bookingRef, newData);

    return { success: true, message: "Booking updated successfully!", bookingId };
  } catch (error) {
    console.error("Update Booking Error: ", error);
    throw error;
  }
};

export const deleteBooking = async (bookingId: string) => {
  try {
    const bookingRef = ref(FDB, `bookings/${bookingId}`);
    const snapshot = await get(bookingRef);
    
    if (!snapshot.exists()) throw new Error("Booking not found");
    
    // Get booking data first
    const bookingData = snapshot.val();
    
    // Find associated book
    const books = await getAllBooks();
    const book = books.find(b => b.SPN_NO === bookingData.SPN_NO);

    // Update book quantity
    if (book) {
      await updateBook(book.id, {
        quantity: book.quantity + 1
      });
    }

    // Delete the booking
    await remove(bookingRef);

    return { success: true, message: "Booking deleted successfully!" };
  } catch (error) {
    console.error("Delete Booking Error: ", error);
    throw error;
  }
};


export const createNotification = async (notification: Notification) => {
  try {
    const notificationsRef = ref(FDB, "notifications");
    const newNotificationRef = push(notificationsRef);
    if (!notification.timestamp) {
      notification.timestamp = new Date().toISOString();
    }
    await set(newNotificationRef, notification);

    return {
      success: true,
      message: "Notification created successfully!",
      notificationId: newNotificationRef.key,
    };
  } catch (error) {
    console.error("Create Notification Error:", error);
    throw error;
  }
};

export const updateNotification = async (notificationId: string) => {
  try {
    const notificationRef = ref(FDB, `notifications/${notificationId}`);

    // Update the isRead field to true
    await update(notificationRef, {
      isRead: true,
    });

    return {
      success: true,
      message: "Notification marked as read successfully!",
      notificationId,
    };
  } catch (error) {
    console.error("Update Notification Error: ", error);
    throw error;
  }
};


export const deleteNotification = async (notificationId: string) => {
  try {
    const notificationRef = ref(FDB, `notifications/${notificationId}`);

    // Delete the notification from Firebase
    await remove(notificationRef);

    return { success: true, message: "Notification deleted successfully!" };
  } catch (error) {
    console.error("Delete Notification Error: ", error);
    throw error;
  }
};

export const getAllNotifications = async () => {
  try {
    const notificationsRef = ref(FDB, "notifications");
    const snapshot = await get(notificationsRef);

    if (snapshot.exists()) {
      const notifications: (Notification & { id: string })[] = [];

      snapshot.forEach((childSnapshot) => {
        const notification = childSnapshot.val();
        notification.id = childSnapshot.key; // Add the auto-generated key as the ID
        
        // Regardless of whether the user is an admin or not, add all notifications
        notifications.push(notification);
      });

      return notifications;
    } else {
      console.log("No notifications found.");
      return [];
    }
  } catch (error) {
    console.error("Get All Notifications Error:", error);
    throw error;
  }
};

export const getUnreadNotificationCount = async () => {
  try {
    const notificationsRef = ref(FDB, "notifications");
    const snapshot = await get(notificationsRef);

    if (snapshot.exists()) {
      let unreadCount = 0;

      snapshot.forEach((childSnapshot) => {
        const notification = childSnapshot.val();
        
        // Check if the notification is unread
        if (notification.isRead === false) {
          unreadCount++;
        }
      });

      return unreadCount;
    } else {
      console.log("No notifications found.");
      return 0;
    }
  } catch (error) {
    console.error("Get Unread Notifications Count Error:", error);
    throw error;
  }
};

export const getLatestBookings = async (currentUser) => {
  try {
    const bookingsRef = ref(FDB, "bookings");

    // Query for the latest 3 bookings added, sorted by Firebase generated keys (created time)
    const latestBookingsQuery = query(bookingsRef, orderByKey(), limitToLast(3));

    const snapshot = await get(latestBookingsQuery);

    if (snapshot.exists()) {
      const bookings: (Booking & { id: string })[] = [];
      snapshot.forEach((childSnapshot) => {
        const booking = childSnapshot.val();
        booking.id = childSnapshot.key; // Add the auto-generated key as the ID
        
        // Check if the user is an admin
        if (currentUser.isAdmin === true) {
          bookings.push(booking); // If admin, show all bookings
        } else {
          // Check if the booking belongs to the user
          const isUserBooking =
            booking.userId === currentUser.id || // Check userId first
            booking.userName === currentUser.displayName; // Fallback to userName

          if (isUserBooking) {
            bookings.push(booking);
          }
        }
      });

      // Reverse to show the most recent first
      return bookings.reverse();
    } else {
      console.log("No bookings found.");
      return [];
    }
  } catch (error) {
    console.error("Get Latest Bookings Error:", error);
    throw error;
  }
};

export const getMonthlyRevenue = async () => {
  try {
    const bookingsRef = ref(FDB, "bookings");
    const snapshot = await get(bookingsRef);

    if (snapshot.exists()) {
      let totalRevenue = 0;
      const currentMonth = new Date().getMonth(); // Get current month (0-indexed)
      const currentYear = new Date().getFullYear(); // Get current year

      snapshot.forEach((childSnapshot) => {
        const booking = childSnapshot.val();
        
        // Extract the booking's dateOfIssue and convert it to a Date object
        const bookingDate = new Date(booking.dateOfIssue);
        const bookingMonth = bookingDate.getMonth();
        const bookingYear = bookingDate.getFullYear();

        // Check if the booking is from the current month and year
        if (bookingMonth === currentMonth && bookingYear === currentYear) {
          // Add the price to the totalRevenue (convert price to a number)
          totalRevenue += parseFloat(booking.price) || 0;
        }
      });

      return { success: true, totalRevenue };
    } else {
      console.log("No bookings found.");
      return { success: true, totalRevenue: 0 };
    }
  } catch (error) {
    console.error("Get Monthly Revenue Error:", error);
    throw error;
  }
};


// Example function to get revenue for a specific month
export const getMonthlyRevenuewithMonthName = async (month: string) => {
  try {
    const bookingsRef = ref(FDB, "bookings");
    const snapshot = await get(bookingsRef);

    if (snapshot.exists()) {
      let totalRevenue = 0;
      const currentYear = new Date().getFullYear(); // Get current year

      snapshot.forEach((childSnapshot) => {
        const booking = childSnapshot.val();
        const bookingDate = new Date(booking.dateOfIssue);
        const bookingMonth = bookingDate.toLocaleString("default", { month: "long" });
        const bookingYear = bookingDate.getFullYear();

        // Check if the booking is from the requested month and current year
        if (bookingMonth === month && bookingYear === currentYear) {
          totalRevenue += parseFloat(booking.price) || 0; // Add the price to the total revenue
        }
      });

      return { success: true, totalRevenue };
    } else {
      console.log("No bookings found.");
      return { success: true, totalRevenue: 0 };
    }
  } catch (error) {
    console.error("Get Monthly Revenue Error:", error);
    throw error;
  }
};



