import React, { useState, useEffect } from "react";
import { IconBase } from "react-icons";
import { FaComment, FaWindowClose } from "react-icons/fa";
import { MdClose, MdDelete } from "react-icons/md";
import { addMemberToGroup, createGroup, deleteGroup, getAllGroups } from "../utils/Groups.ts";
import { getAllUsersExceptCurrent } from "../utils/auth.util.ts";
import { getGroupMessages, sendGroupMessage } from "../utils/groupsMessages.ts";

interface GroupMessage {
  groupId: string,
  senderName: string,
  senderId: string;
  message: string;
  timestamp: string;
}

const GroupChats = () => {
  const [conv, setConv] = useState(false);
  const [message, setMessage] = useState("");
  const [allGroups, setAllGroups] = useState([]);
  const [messages, setMessages] = useState([]);
  const [showMembers, setShowMembers] = useState([]);
  const [addMembers, setAddMembers] = useState([]);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [showViewMembersModal, setShowViewMembersModal] = useState(false);
  const [showAddMembersModal, setShowAddMembersModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [allUsers, setAllUSers] = useState([])
  const [sentUsers, setSentUsers] = useState([])
  const currentUser = JSON.parse(localStorage.getItem("adminUser") || "{}");

  const fetchAllMessages = async () => {
    try {
      const response = await getGroupMessages(selectedGroup?.id)
      setMessages(response)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchAllMessages();
    const intervalId = setInterval(fetchAllMessages, 3000);
    return () => {
      clearInterval(intervalId);
    };
  }, [selectedGroup?.id])

  const handleSendMessage = async (e: React.HTMLInputElement) => {
    e.preventDefault();
    const newMessage: GroupMessage = {
      groupId: selectedGroup?.id,
      senderName: currentUser?.displayName,
      senderId: currentUser?.id,
      message: message,
      timestamp: `${Date.now()}`
    }
    console.log(newMessage)
    try {
      const response = await sendGroupMessage(selectedGroup?.id, newMessage);
      console.log(response)
      setMessages((prev) => [...prev, newMessage])
      setMessage("")
      fetchAllMessages();
    } catch (err) {
      console.log(err)
    }
  };

  const fetchAllUsers = async () => {
    try {
      const allusers = await getAllUsersExceptCurrent(currentUser?.id)
      // console.log(allusers)
      setAllUSers(allusers)
    } catch (err) {
      console.log(err.message)
    }
  }

  const fetchAllGroups = async () => {
    try {
      const response = await getAllGroups(currentUser?.id);
      // console.log('all groups', response);
      setAllGroups(response);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAllUsers();
    fetchAllGroups();
  }, []);

  const handleCreateGroup = async () => {
    console.log("Group Created", { groupName, groupDescription });
    const newGroupData = {
      name: groupName,
      description: groupDescription,
      adminId: currentUser?.id,
      members: [currentUser?.id],
    };
    try {
      const response = await createGroup(newGroupData);
      console.log('resp', response);
      fetchAllGroups();
    } catch (err) {
      console.log(err);
    }
    setShowCreateGroup(false); // Close the create group popup after creation
  };

  const handleSendGroupInvitation = async (id: string) => {
    console.log('sendgrpinv',selectedGroup?.id, id)
    try{
      const response = await addMemberToGroup(selectedGroup?.id, id)
      console.log(response)
      alert('memeber added')
    }catch(err){
      console.log(err)
    }
  }

  const handleDeleteGroup = async (id:string) =>{
    try{
      const response = await deleteGroup(id);
      console.log(response);
      fetchAllGroups();
    }catch(err){
      console.log(err)
    }
  }

  return (
    <>
      {/* Create New Group Button */}
      <div className="pt-6 pb-4 px-5">
        <button
          onClick={() => setShowCreateGroup(true)} // Show create group popup
          className="px-5 py-2 bg-blue-500 text-white text-sm font-medium rounded-full shadow-sm hover:bg-blue-600 transition-colors duration-200"
        >
          Create New Group
        </button>
      </div>

      {/* Group List */}
      {allGroups.map((g, i) => {
        return (
          <div key={i} className="pt-6 shadow-lg w-full relative">
            <div className="flex flex-col md:flex-row gap-4 md:gap-0 items-center mt-4 justify-between bg-white md:p-5 shadow-lg rounded-xl w-full hover:shadow-2xl transition-shadow duration-300">
              <div className="flex w-[100%] md:w-auto items-center">
                <img
                  src="https://via.placeholder.com/48"
                  alt="Group"
                  className="w-14 h-14 rounded-full mr-5 border-2 border-gray-300 shadow-sm"
                />
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-200">
                    {g?.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200">
                      {g?.description}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">{g?.members?.length} members</p>
                  <div className="flex mt-2 -space-x-2">
                    <div className="flex w-7 items-center justify-center h-7 rounded-full bg-[lightgrey] border-2 uppercase border-white shadow-sm">
                      A
                    </div>
                    <div className="flex w-7 items-center justify-center h-7 rounded-full bg-[lightgrey] border-2 uppercase border-white shadow-sm">
                      B
                    </div>
                  </div>
                  {
                    currentUser?.id === g?.adminId &&
                    <>
                      <button
                        onClick={() => {
                          setSelectedGroup(g);
                          setShowViewMembersModal(true);
                        }}
                        className="px-5 hidden md:block py-1.5 mt-3 md:mt-0 bg-green-500 text-white text-sm font-medium rounded-full shadow-sm hover:bg-green-600 transition-colors duration-200"
                      >
                        View members
                      </button>
                    </>
                  }
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setConv(true)
                    setSelectedGroup(g)
                  }}
                  className="px-5 py-1.5 bg-gray-200 flex flex-row items-center justify-center text-gray-700 text-sm font-medium rounded-full shadow-sm hover:bg-gray-300 transition-colors duration-200"
                >
                  <FaComment />
                  Chat
                </button>
                <button
                  onClick={() => {
                    setSelectedGroup(g);
                    setShowAddMembersModal(true);
                  }}
                  className="px-5 hidden md:block py-1.5 mt-3 md:mt-0 bg-green-500 text-white text-sm font-medium rounded-full shadow-sm hover:bg-green-600 transition-colors duration-200"
                >
                  Add members
                </button>
                {currentUser?.id === g?.adminId &&
                <button
                  onClick={() => handleDeleteGroup(g?.id)
                }
                  className="px-5 hidden md:block py-1.5 mt-3 md:mt-0 bg-red-500 text-white text-sm font-medium rounded-full shadow-sm hover:bg-red-600 transition-colors duration-200"
                >
                  <MdDelete />
                </button>
      }
              </div>
            </div>
          </div>
        );
      })}

      {/* Chat Modal */}
      {conv && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 relative rounded-lg shadow-lg md:w-full w-[95%] max-w-2xl h-[80vh]">
            <div className="absolute text-[black] text-xl right-4 top-4">
              <IconBase>
                <span onClick={() => setConv(false)}>
                  <MdClose />
                </span>
              </IconBase>
            </div>

            <div className="flex flex-col h-full">
              {/* Chat Header */}
              <div className="flex items-center space-x-4 p-4 border-b">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xl font-semibold text-blue-600">G</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{selectedGroup?.name}</h2>
                  <p className="text-sm text-gray-500">{selectedGroup?.members?.length} members</p>
                </div>
                <span
                  className="text-[tomato] text-xl cursor-pointer ml-auto"
                  onClick={() => setConv(false)}
                >
                  <FaWindowClose />
                </span>
              </div>

              {/* Messages Container */}
              <div
                className="flex-1 overflow-y-auto p-4 space-y-4"
                style={{ maxHeight: "calc(80vh - 200px)" }}
              >
                {messages.map((m, i) => {
                  return (
                    <div className={`flex ${m?.senderId !== currentUser?.id ? 'justify-start' : 'justify-end'}`} key={i}>
                      <div className="flex flex-row items-end space-x-2 max-w-[70%]">
                        <div className={`w-8 h-8 rounded-full ${m?.senderId === currentUser?.id ? 'bg-[#0833a9] text-[white]' : 'bg-gray-200'} flex items-center justify-center flex-shrink-0`}>
                          <span className="text-sm font-medium">{m?.senderName?.substring(0, 1).toUpperCase()}</span>
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="text-xs text-gray-500 mb-1">{m?.senderName}</span>
                          <div className={`${m?.senderId === currentUser?.id ? 'bg-[#0833a9] text-[white]' : 'bg-gray-200 text-gray-800'} rounded-lg p-3 rounded-bl-none`}>
                            <p className="text-sm whitespace-pre-wrap break-words">
                              {
                                m?.message
                              }
                            </p>
                            <div className="text-xs mt-1 text-gray-500">{new Date(Number(m?.timestamp)).toDateString()}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
                }
              </div>

              {/* Message Input */}
              <div className="p-4 border-t">
                <form className="flex space-x-4" onSubmit={handleSendMessage}>
                  <div className="flex-1">
                    <input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      type="text"
                      placeholder="Type a message..."
                      className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white focus:outline-none transition-colors"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create New Group Modal */}
      {showCreateGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 relative rounded-lg shadow-lg md:w-full w-[95%] max-w-lg">
            <div className="absolute text-[black] text-xl right-4 top-4">
              <IconBase>
                <span onClick={() => setShowCreateGroup(false)}>
                  <MdClose />
                </span>
              </IconBase>
            </div>

            <h2 className="text-xl font-semibold mb-4">Create New Group</h2>
            <input
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              type="text"
              placeholder="Group Name"
              className="w-full px-4 py-2 border rounded-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              placeholder="Group Description"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setShowCreateGroup(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-full"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGroup}
                className="px-4 py-2 bg-blue-500 text-white text-sm rounded-full"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Members Modal */}
      {showViewMembersModal && selectedGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 relative rounded-lg shadow-lg w-[90%] max-w-lg">
            <div className="absolute text-[black] text-xl right-4 top-4">
              <button onClick={() => setShowViewMembersModal(false)} className='px-2 py-1 text-sm rounded-md bg-[tomato] text-[white]'>close</button>
            </div>

            <h2 className="text-xl font-semibold mb-4">Members of {selectedGroup?.name}</h2>
            <div
              className="max-h-72 overflow-y-auto" // Make it scrollable
              style={{ maxHeight: "300px" }}
            >
              {selectedGroup?.members?.length > 0 ? (
                selectedGroup.members.map((member, index) => (
                  <div key={index} className="flex items-center space-x-4 p-2 border-b">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      {/* <span className="text-sm font-medium">{member.charAt(0).toUpperCase()}</span> */}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{member}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No members added yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Members Modal */}
      {showAddMembersModal && selectedGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 relative rounded-lg shadow-lg w-[90%] max-w-lg">
            <div className="absolute text-[black] text-xl right-4 top-4">
              <button onClick={() => setShowAddMembersModal(false)} className='px-2 py-1 text-sm rounded-md bg-[tomato] text-[white]'>close</button>
            </div>

            <h2 className="text-xl font-semibold mb-4">Add Members to {selectedGroup?.name}</h2>
            <div
              className="max-h-72 overflow-y-auto" // Make it scrollable
              style={{ maxHeight: "300px" }}
            >
              {/* Replace this with actual users to add */}
              {allUsers.map((user, index) => (
                <div key={index} className="flex items-center space-x-4 p-2 border-b">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-sm font-medium">{user?.displayName?.substring(0, 1).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{user.displayName}</p>
                    {
                      // (!(selectedGroup.members.includes(user?.id)) || !(sentUsers.includes(user?.id))) &&
                      !(selectedGroup?.members?.includes(user?.id)) &&
                      <button className="text-sm text-blue-600" onClick={() => handleSendGroupInvitation(user?.id)}>Add</button>
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GroupChats;

