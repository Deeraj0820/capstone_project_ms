import React, { useState,useEffect } from "react";
import { FaComment, FaWindowClose } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { getAllUsersExceptCurrent } from "../utils/auth.util.ts";
import { createMessage, getMessagesBetweenUsers } from "../utils/messages.ts";

interface Message {
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: number;
}

const ChatSection = () => {
  const [conv, setConv] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState("");
  const [receiver, setReceiver] = useState([]);
  const [users, setUsers] = useState([]);

  const otherUser = "John Doe";  // The name of the other user
  const otherUserImage = "https://via.placeholder.com/48";  // Profile image URL

  const currentUser = JSON.parse(localStorage.getItem("adminUser") || "{}");

  const fetchAllUsers = async () =>{
    try{
      const allusers = await getAllUsersExceptCurrent(currentUser?.id)
      const filtered = allusers.filter((u,i)=>u?.id !==currentUser?.id)
      // console.log(filtered)
      setUsers(filtered)
    }catch(err){
      console.log(err.message)
    }
  }

  const fetchAllMessages = async () =>{
    try{
      const resp = await getMessagesBetweenUsers(currentUser?.id, receiver?.id)
      // console.log("all",resp)
      setMessages(resp)
    }catch(err){
      console.log(err.message)
    }
  }

  useEffect(() => {
    fetchAllMessages();
    const intervalId = setInterval(fetchAllMessages, 3000);
    return () => {
      clearInterval(intervalId);
    };
  }, [currentUser?.id, receiver?.id]); 

    useEffect(()=>{
      fetchAllUsers();
    },[])

    const handleSendMessage = async (e: React.FormEvent) => {
      const newMessage: Message = {
        senderId: currentUser?.id,
        receiverId: receiver?.id,
        message: message,
        timestamp: Date.now()
      };
  
      e.preventDefault();
      if (message.trim() !== "") {
        const response = await createMessage(newMessage);
        console.log(response)
        fetchAllMessages();
      }
      setMessage(" ")
      setMessages((prev)=>[...prev, newMessage])
    };
  

  return (
    <>
    {users.map((u,i)=>{
      return (
      <div>
        <div className="pt-6 shadow-lg w-full relative">
          <div className="flex flex-col md:flex-row gap-4 md:gap-0 items-center mt-4 justify-between bg-white md:p-5 shadow-lg rounded-xl w-full hover:shadow-2xl transition-shadow duration-300">
            <div className="flex w-[100%] md:w-auto items-center">
              <img
                src={"https://cdn.pixabay.com/photo/2019/08/11/18/59/icon-4399701_1280.png"}
                alt="User"
                className="w-14 h-14 rounded-full mr-5 border-2 border-gray-300 shadow-sm"
              />
              <div>
                <h2 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-200">
                  {u?.displayName}
                </h2>
                {/* <p className="text-sm text-gray-500">Online</p> */}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() =>{
                   setConv(true)
                   setReceiver(u)
                }}
                className="px-5 py-1.5 bg-gray-200 flex flex-row items-center justify-center text-gray-700 text-sm font-medium rounded-full shadow-sm hover:bg-gray-300 transition-colors duration-200"
              >
                <FaComment />
                Chat

              </button>
            </div>
          </div>
        </div>
      </div>
      )
          })
}

      {/* Chat Modal */}
      {conv && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 relative rounded-lg shadow-lg md:w-full w-[95%] max-w-2xl h-[80vh]">
            <div className="absolute text-[black] text-xl right-4 top-4">
              <span onClick={() => setConv(false)}>
                <MdClose />
              </span>
            </div>

            <div className="flex flex-col h-full">
              {/* Chat Header */}
              <div className="flex items-center space-x-4 p-4 border-b">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <img
                    src={otherUserImage}
                    alt="User"
                    className="w-10 h-10 rounded-full"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {receiver?.displayName}
                  </h2>
                  <p className="text-sm text-gray-500">Online</p>
                </div>
              </div>

              {/* Messages Container */}
              <div
                className="flex-1 overflow-y-auto p-4 space-y-4"
                style={{ maxHeight: "calc(80vh - 200px)" }}
              >
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex justify-${msg.senderId === currentUser?.id ? "end" : "start"}`}
                  >
                    <div className={`flex flex-row items-end space-x-2 max-w-[70%]`}>
                      {msg.senderId === currentUser?.id ? (
                        <div className="">
                          {/* <span className="text-sm font-medium">You</span> */}
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium"></span> {/* Initial of other user */}
                        </div>
                      )}
                      <div className="flex flex-col items-start">
                        <span className="text-xs text-gray-500 mb-1">
                          {/* {msg.sender} */}
                        </span>
                        <div
                          className={`${
                            msg.senderId === currentUser?.id ? "bg-[#0a3d85] text-[white]" : "bg-gray-100  text-gray-800"
                          } rounded-lg p-3 rounded-bl-none`}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">
                            {msg?.message}
                          </p>
                          <div className={`text-xs mt-1 ${msg?.senderId === currentUser?.id ? 'text-[white]' : 'text-gray-500'} `}>{new Date(msg?.timestamp).toLocaleTimeString()}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
    </>
  );
};

export default ChatSection;
