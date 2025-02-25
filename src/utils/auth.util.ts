import { FDB } from "../config/firebase.ts"
import Swal from "sweetalert2";
import { ref, set, query, get, update, remove, child, push, orderByChild, limitToLast } from "firebase/database";

// Define User Type
interface User {
  id: string;
  email: string;
  password: string;
  isAdmin: boolean,
  displayName?: string,
  mobile?: string
}

interface LoginCredentials {
  email: string;
  password: string;
}

const showToast = ({ icon = "", title = "" }) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-right",
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  Toast.fire({
    icon: icon,
    title: title,
  });

};


// export const signupUSer = async ({ email, password, displayName, mobile }: User) => {
//   try {
//     const usersRef = ref(FDB, "users");
//     const newUserRef = push(usersRef);
//     await set(newUserRef, {
//       id: newUserRef.key,
//       email,
//       password,
//       isAdmin: false,
//       displayName,
//       mobile,
//     });

//     return { id: newUserRef.key, email, displayName };
//   } catch (error) {
//     console.error("Signup Error: ", error);
//     throw error;
//   }
// };

// ** Sign Up (Create User) **
export const signupUSer = async ({ email, password, displayName, mobile }: User) => {
  try {
    const currentMonth = new Date().toLocaleString('default', { month: 'long' }); // Get current month name
    const currentYear = new Date().getFullYear(); // Get current year

    // Reference to the users list
    const usersRef = ref(FDB, "users");
    const newUserRef = push(usersRef);
    await set(newUserRef, {
      id: newUserRef.key,
      email,
      password,
      isAdmin: false,
      displayName,
      mobile,
      registrationMonth: currentMonth,
      registrationYear: currentYear, // Store month and year
    });

    return { id: newUserRef.key, email, displayName };
  } catch (error) {
    console.error("Signup Error: ", error);
    throw error;
  }
};


// ** Login (Retrieve User) **
export const loginUser = async ({ email, password }: LoginCredentials) => {
  try {
    const usersRef = ref(FDB, "users");
    const snapshot = await get(usersRef);

    if (snapshot.exists()) {
      const users = snapshot.val();
      for (const userId in users) {
        if (users[userId].email === email && users[userId].password === password) {
          // Return user information along with userId
          return { id: userId, ...users[userId] };
        }
      }
    }
    // If credentials are incorrect, show a toast message
    showToast({ icon: "error", title: "invalid email or password !" });


    throw new Error("Invalid email or password");
  } catch (error) {
    console.error("Login Error: ", error);
    throw error;
  }
};

// ** Update User **
export const updateUser = async (id: string, newData: Partial<Omit<User, "id">>) => {
  try {
    const userRef = ref(FDB, `users/${id}`);

    await update(userRef, newData);

    return { id, ...newData };
  } catch (error) {
    console.error("Update User Error: ", error);
    throw error;
  }
};

// ** Delete User **
export const deleteUserAccount = async (id: string) => {
  try {
    const userRef = ref(FDB, `users/${id}`);
    await remove(userRef);
    console.log("User deleted successfully!");
  } catch (error) {
    console.error("Delete User Error: ", error);
    throw error;
  }
};


// export const createNewUser = async (adminId: string, newUser: User) => {
//   try {
//     const adminRef = ref(FDB, `users/${adminId}`);
//     const adminSnapshot = await get(adminRef);

//     if (!adminSnapshot.exists() || !adminSnapshot.val().isAdmin) {
//       throw new Error("Unauthorized: Only admins can create new users.");
//     }
//     const usersRef = ref(FDB, "users");
//     const newUserRef = push(usersRef);
//     await set(newUserRef, {
//       ...newUser,
//       isAdmin: newUser.isAdmin || false,
//     });

//     return { success: true, message: "User created successfully.", userId: newUserRef.key };
//   } catch (error) {
//     console.error("Create User Error: ", error);
//     throw error;
//   }
// };


export const createNewUser = async (adminId: string, newUser: User) => {
  try {
    // Reference to the admin user
    const adminRef = ref(FDB, `users/${adminId}`);
    const adminSnapshot = await get(adminRef);

    if (!adminSnapshot.exists() || !adminSnapshot.val().isAdmin) {
      throw new Error("Unauthorized: Only admins can create new users.");
    }

    // Get current month and year for registration
    const currentMonth = new Date().toLocaleString('default', { month: 'long' }); // Get current month name
    const currentYear = new Date().getFullYear(); // Get current year

    // Reference to the users list
    const usersRef = ref(FDB, "users");

    // Generate a unique ID for the new user using Firebase's push() method
    const newUserRef = push(usersRef);

    // Add the new user with the auto-generated ID
    await set(newUserRef, {
      ...newUser,
      isAdmin: newUser.isAdmin || false, // Default to non-admin if not specified
      registrationMonth: currentMonth,  // Store registration month
      registrationYear: currentYear,   // Store registration year
    });

    return { success: true, message: "User created successfully.", userId: newUserRef.key };
  } catch (error) {
    console.error("Create User Error: ", error);
    throw error;
  }
};



export const getAllUsersExceptCurrent = async (currentUserId: string) => {
  try {
    const usersRef = ref(FDB, "users");
    const snapshot = await get(usersRef);

    if (!snapshot.exists()) {
      return [];
    }

    const users = snapshot.val();
    const filteredUsers = Object.keys(users)
      .filter((userId) => userId !== currentUserId) // Exclude current user
      .map((userId) => ({ id: userId, ...users[userId] }));

    return filteredUsers;
  } catch (error) {
    console.error("Get Users Error: ", error);
    throw error;
  }
};

export const getLastThreeUsers = async () => {
  try {
    const usersRef = ref(FDB, "users");

    // Query to get the latest 3 users based on the auto-generated push key
    const snapshot = await get(usersRef);

    if (!snapshot.exists()) {
      return [];
    }

    const users = snapshot.val();

    // Get the last 3 users by sorting the keys (since they are generated in order)
    const lastThreeUsers = Object.keys(users)
      .slice(-3)  // Take the last 3 users
      .map((userId) => ({
        id: userId,
        ...users[userId],
      }));

    return lastThreeUsers;
  } catch (error) {
    console.error("Get Last 3 Users Error: ", error);
    throw error;
  }
};

export const getUsersByMonth = async (month: string, year: number) => {
  try {
    const usersRef = ref(FDB, "users");
    const snapshot = await get(usersRef);

    if (!snapshot.exists()) {
      return [];
    }

    const users = snapshot.val();
    const filteredUsers = Object.keys(users)
      .filter((userId) => users[userId].registrationMonth === month && users[userId].registrationYear === year)
      .map((userId) => ({ id: userId, ...users[userId] }));

    return filteredUsers;
  } catch (error) {
    console.error("Get Users By Month Error: ", error);
    throw error;
  }
};


