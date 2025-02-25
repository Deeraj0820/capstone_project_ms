import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.tsx";
import { createNewUser } from "../utils/auth.util.ts";
import { useNavigate } from "react-router-dom";

const AddUser: React.FC = () => {
  const currentUser = JSON.parse(localStorage.getItem("adminUser") || "{}");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    displayName: "",
    mobile: "",
    role: "User",
  });

  const navigate = useNavigate();

  // console.log('cy', currentUser)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newuser = await createNewUser(currentUser?.id , formData)
    console.log("User Added:", newuser);
    if(newuser.success){
      alert('user created')
      setFormData({
        name: "",
        email: "",
        password: "",
        displayName: "",
        mobile: "",
        role: "User",
      })
    }
    // Handle form submission logic here (API call)
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Add User</h1>
      <form className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg mx-auto" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter full name"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter email address"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter password"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Display Name</label>
          <input
            type="text"
            name="displayName"
            value={formData.displayName}
            onChange={handleInputChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter display name"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Mobile</label>
          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleInputChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter mobile number"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value={false}>User</option>
            <option value={true}>Admin</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button type="reset" className="bg-gray-500 text-white px-4 py-2 rounded mr-2">
            Reset
          </button>
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
            Add User
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;
