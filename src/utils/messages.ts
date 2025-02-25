import { FDB } from "../config/firebase.ts";
import { ref, set, get, update, remove, push } from "firebase/database";

// Define Message Type
interface Message {
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: number;
}

// ** Create a New Message **
export const createMessage = async (message: Message) => {
  try {
    const messagesRef = ref(FDB, "messages");
    const newMessageRef = push(messagesRef);

    // Save the message data to Firebase
    await set(newMessageRef, message);

    return { success: true, message: "Message sent successfully!", messageId: newMessageRef.key };
  } catch (error) {
    console.error("Create Message Error:", error);
    throw error;
  }
};

// ** Retrieve All Messages Between Two Users **
export const getMessagesBetweenUsers = async (senderId: string, receiverId: string) => {
    // console.log('inside message', senderId, receiverId)
  try {
    const messagesRef = ref(FDB, "messages");
    const snapshot = await get(messagesRef);

    if (snapshot.exists()) {
      const messages: Message[] = [];
      snapshot.forEach((childSnapshot) => {
        const message = childSnapshot.val();
        message.id = childSnapshot.key; // Add the auto-generated key as the ID

        // Only include messages between sender and receiver
        if (
          (message.senderId === senderId && message.receiverId === receiverId) ||
          (message.senderId === receiverId && message.receiverId === senderId)
        ) {
          messages.push(message);
        }
      });
      return messages;
    } else {
      console.log("No messages found.");
      return [];
    }
  } catch (error) {
    console.error("Get Messages Error:", error);
    throw error;
  }
};

// ** Update a Message (e.g., edited message) **
export const updateMessage = async (messageId: string, newData: Partial<Omit<Message, "id">>) => {
  try {
    const messageRef = ref(FDB, `messages/${messageId}`);

    await update(messageRef, newData);

    return { success: true, message: "Message updated successfully!", messageId };
  } catch (error) {
    console.error("Update Message Error: ", error);
    throw error;
  }
};

// ** Delete a Message **
export const deleteMessage = async (messageId: string) => {
  try {
    const messageRef = ref(FDB, `messages/${messageId}`);
    await remove(messageRef);

    return { success: true, message: "Message deleted successfully!" };
  } catch (error) {
    console.error("Delete Message Error: ", error);
    throw error;
  }
};
