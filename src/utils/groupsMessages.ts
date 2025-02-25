import { FDB } from "../config/firebase.ts";
import { ref, push, set, get } from "firebase/database";

// Define Message Type
interface GroupMessage {
  groupId:string,
  senderName:string,
  senderId: string;
  message: string;
  timestamp: string;
}

// Send Message to a Group
export const sendGroupMessage = async (groupId: string, message: GroupMessage) => {
  try {
    const messagesRef = ref(FDB, `groups/${groupId}/messages`); 
    const newMessageRef = push(messagesRef);

    await set(newMessageRef, message);

    return { success: true, message: "Message sent successfully!", messageId: newMessageRef.key };
  } catch (error) {
    console.error("Send Group Message Error:", error);
    throw error;
  }
};

// Get All Messages for a Specific Group
export const getGroupMessages = async (groupId: string) => {
    try {
      const messagesRef = ref(FDB, `groups/${groupId}/messages`);
      const snapshot = await get(messagesRef);
  
      if (snapshot.exists()) {
        const messages: GroupMessage[] = [];
        snapshot.forEach((childSnapshot) => {
          const message = childSnapshot.val();
          message.id = childSnapshot.key;  // Add the auto-generated key as the ID
          messages.push(message);
        });
        return messages;
      } else {
        console.log("No messages found for this group.");
        return [];
      }
    } catch (error) {
      console.error("Get Group Messages Error:", error);
      throw error;
    }
  };
  
