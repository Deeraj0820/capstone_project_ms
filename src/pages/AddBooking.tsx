import React, { useState } from "react";
import { createBooking } from "../utils/bookings.ts";
import { useLocation } from "react-router-dom";

const AddBooking: React.FC = () => {
  const location = useLocation();
  // Initialize booking details with the new "dateOfSubmit" field
  const [bookingDetails, setBookingDetails] = useState({
    userId: location?.state?.user?.id || "",
    userName: location?.state?.user?.displayName || "",
    bookName: location?.state?.bookDetail?.name || "",
    SPN_NO: location?.state?.bookDetail?.SPN_NO || "",
    author: location?.state?.bookDetail?.author || "",
    dateOfIssue: "",
    dateOfSubmit: "",
    price: location?.state?.bookDetail?.price || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookingDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await createBooking(bookingDetails);
      console.log(response);
      alert("Booking added successfully!");
      // Reset the form
      setBookingDetails({
        userId: "",
        userName: "",
        bookName: "",
        SPN_NO: "",
        author: "",
        dateOfIssue: "",
        dateOfSubmit: "",
        price: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">Add New Booking</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-white p-6 shadow-md rounded-lg"
      >
        {/* Username */}
        <label className="block mb-3">
          <span className="block text-gray-700 mb-2">Username</span>
          <input
            type="text"
            name="userName"
            value={bookingDetails.userName}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter username"
            required
          />
        </label>

        {/* User ID */}
        <label className="block mb-3">
          <span className="block text-gray-700 mb-2">User ID</span>
          <input
            type="text"
            name="userId"
            value={bookingDetails.userId}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter user ID"
            required
          />
        </label>

        {/* Book Name */}
        <label className="block mb-3">
          <span className="block text-gray-700 mb-2">Book Name</span>
          <input
            type="text"
            name="bookName"
            value={bookingDetails.bookName}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter book name"
            required
          />
        </label>

        {/* SPN_NO */}
        <label className="block mb-3">
          <span className="block text-gray-700 mb-2">SPN_NO</span>
          <input
            type="text"
            name="SPN_NO"
            value={bookingDetails.SPN_NO}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter book SPN_NO"
          />
        </label>

        {/* Author */}
        <label className="block mb-3">
          <span className="block text-gray-700 mb-2">Author</span>
          <input
            type="text"
            name="author"
            value={bookingDetails.author}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter author name"
          />
        </label>

        {/* Date of Issue */}
        <label className="block mb-3">
          <span className="block text-gray-700 mb-2">Date of Issue</span>
          <input
            type="date"
            name="dateOfIssue"
            value={bookingDetails.dateOfIssue}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </label>

        {/* Date of Submit */}
        <label className="block mb-3">
          <span className="block text-gray-700 mb-2">Date of Submit</span>
          <input
            type="date"
            name="dateOfSubmit"
            value={bookingDetails.dateOfSubmit}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </label>

        {/* Price */}
        <label className="block mb-6">
          <span className="block text-gray-700 mb-2">Price (₹)</span>
          <input
            type="number"
            name="price"
            value={bookingDetails.price}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter price"
            required
          />
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 transition"
        >
          Add Booking
        </button>
      </form>
    </div>
  );
};

export default AddBooking;
