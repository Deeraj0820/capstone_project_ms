 import { arrayUnion } from "firebase/firestore";
import { FDB } from "../config/firebase.ts";
import { ref, set, push, get, update, remove } from "firebase/database";


interface Group {
    name: string;
    description: string;
    adminId: string;
    members: string[]; 
  }

  

// ** Create a New Group **
export const createGroup = async (group: Group) => {
  try {
    const groupsRef = ref(FDB, "groups");
    const newGroupRef = push(groupsRef); 
    await set(newGroupRef, group);

    return { success: true, message: "Group created successfully!", groupId: newGroupRef.key };
  } catch (error) {
    console.error("Create Group Error:", error);
    throw error;
  }
};


export const getAllGroups = async (currentUserId:string) => {
  try {
    const groupsRef = ref(FDB, "groups");
    const snapshot = await get(groupsRef);

    if (snapshot.exists()) {
      const groups: Group[] = [];
      
      snapshot.forEach((childSnapshot) => {
        const group = childSnapshot.val();
        group.id = childSnapshot.key;

        if (group.adminId === currentUserId || group.members.includes(currentUserId)) {
          groups.push(group);
        }
      });
      
      return groups;
    } else {
      console.log("No groups found.");
      return [];
    }
  } catch (error) {
    console.error("Get All Groups Error:", error);
    throw error;
  }
};

  
  // ** Update Group **
export const updateGroup = async (groupId: string, newData: Partial<Omit<Group, "id">>) => {
    try {
      const groupRef = ref(FDB, `groups/${groupId}`);
  
      await update(groupRef, newData);
  
      return { success: true, message: "Group updated successfully!", groupId };
    } catch (error) {
      console.error("Update Group Error: ", error);
      throw error;
    }
  };

  
  // ** Delete Group **
export const deleteGroup = async (groupId: string) => {
    try {
      const groupRef = ref(FDB, `groups/${groupId}`);
      await remove(groupRef);
  
      return { success: true, message: "Group deleted successfully!" };
    } catch (error) {
      console.error("Delete Group Error: ", error);
      throw error;
    }
  };

  
  export const addMemberToGroup = async (groupId: string, memberId: string) => {
    try {
      const groupRef = ref(FDB, `groups/${groupId}`);
  
      // Fetch the current group data
      const snapshot = await get(groupRef);
  
      if (snapshot.exists()) {
        const group = snapshot.val();
  
        // Check if the member already exists in the group
        if (!group.members.includes(memberId)) {
          // Add the new member to the members array
          group.members.push(memberId);
  
          // Update the group in the database
          await update(groupRef, { members: group.members });
  
          return { success: true, message: "Member added successfully!" };
        } else {
          return { success: false, message: "Member already exists in the group!" };
        }
      } else {
        return { success: false, message: "Group not found!" };
      }
    } catch (error) {
      console.error("Add Member to Group Error: ", error);
      throw error;
    }
  };
  


  