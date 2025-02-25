import React, { useState, useEffect } from "react";
import { deleteUserAccount, getAllUsersExceptCurrent, updateUser } from "../utils/auth.util.ts";

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  displayName: string;
  mobile: string;
}

const AllUsers: React.FC = () => {
  const currentUser = JSON.parse(localStorage.getItem("adminUser") || "{}");

  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editUser, setEditUser] = useState<User | null>(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState<number | null>(null);

  const fetchAllUsers = async () =>{
    try{
      const users = await getAllUsersExceptCurrent(currentUser?.id)
      setUsers(users)
    }catch(err){
      console.log(err.message)
    }
  }

  useEffect(()=>{
    fetchAllUsers();
  },[])

  const handleEditClick = (user: User) => {
    setEditUser(user);
    setShowEditPopup(true);
  };

  const handleDeleteClick = (userId: number) => {
    setShowDeletePopup(userId);
  };

  const handleUpdateUser = async () => {
    if (editUser) {
      try{
        const updated = await updateUser(editUser?.id,editUser)
        setShowEditPopup(false);
        fetchAllUsers();
      }catch(err){
        console.log(err.message)
      }
    }
  };

  const handleDeleteUser = async () => {
    if (showDeletePopup !== null) {
      try{
        const deleted = await deleteUserAccount(showDeletePopup)
        console.log(deleted);
        fetchAllUsers();
      }catch(err){
        console.log(err)
      }
      setShowDeletePopup(null);
    }
  };

  const filteredUsers = users ? users.filter(user => 
    user.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">All Users</h1>
      <input 
        type="text" 
        placeholder="Search by name" 
        className="w-full border px-3 py-2 mb-4 rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr>
            <th className="p-4 text-left">Id</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="p-4">{user.id}</td>
                <td className="p-4">{user.displayName}</td>
                <td className="p-4">{user.isAdmin ? 'Admin' : 'User'}</td>
                <td className="p-4 text-right">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                    onClick={() => handleEditClick(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => handleDeleteClick(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit User Popup */}
      {showEditPopup && editUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Edit User</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                value={editUser.email}
                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                value={editUser.password}
                onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Display Name</label>
              <input
                type="text"
                value={editUser.displayName}
                onChange={(e) => setEditUser({ ...editUser, displayName: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Mobile</label>
              <input
                type="tel"
                value={editUser.mobile}
                onChange={(e) => setEditUser({ ...editUser, mobile: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div className="flex justify-end">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => setShowEditPopup(false)}
              >
                Cancel
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleUpdateUser}>
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {showDeletePopup !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-6">Are you sure you want to delete this user?</p>
            <div className="flex justify-end">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => setShowDeletePopup(null)}
              >
                Cancel
              </button>
              <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleDeleteUser}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsers;
