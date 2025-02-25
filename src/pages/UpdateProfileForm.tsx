import React, { useState } from "react";
import { updateUser } from "../utils/auth.util.ts";

const ProfileUpdateForm: React.FC<{ userId: string }> = ({ userId }) => {

    const currentUser = JSON.parse(localStorage.getItem("adminUser") || "{}");

    const [displayName, setDisplayName] = useState(currentUser?.displayName);
    const [email, setEmail] = useState(currentUser?.email);
    const [password, setPassword] = useState(currentUser?.password);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Call your existing Firebase function here
        try {
            const response = await updateUser(currentUser?.id, { displayName, email, password })
            console.log(response)
            setMessage("Profile updated successfully!");
        } catch (error) {
            console.error("Update Error: ", error);
            setMessage("Failed to update profile.");
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Update Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Display Name Field */}
                <div>
                    <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                        Name
                    </label>
                    <input
                        type="text"
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your name"
                    />
                </div>

                {/* Email Field */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your email"
                    />
                </div>

                {/* Password Field */}
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your password"
                    />
                </div>

                {/* Save Button */}
                <div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Save Changes
                    </button>
                </div>

                {/* Success/Error Message */}
                {message && (
                    <p className={`mt-4 text-center ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
                        {message}
                    </p>
                )}
            </form>
        </div>
    );
};

export default ProfileUpdateForm;