import React, { useState, useEffect } from "react";
import { createBooking, deleteBooking, getAllBookings, updateBooking } from "../utils/bookings.ts";
import { updateBook } from "../utils/books.ts";

interface Booking {
  userId: string;
  id: number;
  bookName: string;
  userName: string;
  dateOfIssue: string;
  dateOfSubmit: string;
  price: number;
}

const BookingDetails: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([
    { id: 1, bookName: "Book One", userName: "User A", dateOfIssue: "2025-01-20", dateOfSubmit: "2025-01-21", price: 200, userId: "1" },
    { id: 2, bookName: "Book Two", userName: "User B", dateOfIssue: "2025-01-25", dateOfSubmit: "2025-01-26", price: 150, userId: "2" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const currentUser = JSON.parse(localStorage.getItem("adminUser") || "{}");
  const [editBooking, setEditBooking] = useState<Booking | null>(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState<number | null>(null);

  const fetchAllBookings = async () => {
    try {
      const response = await getAllBookings(currentUser);
      setBookings(response);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const handleUpdateBooking = async () => {
    if (editBooking) {
      try {
        const res = await updateBooking(editBooking.id, editBooking);
        console.log(res);
        fetchAllBookings();
        setShowEditPopup(false);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleDeleteBooking = async () => {
    if (showDeletePopup !== null) {
      try {
        const res = await deleteBooking(showDeletePopup);
        console.log(res, 'del');
        fetchAllBookings();
        setShowDeletePopup(null);
      } catch (err) {
        console.log(err);
      }
    }
  };

  // Adjust filtering (adding dateOfSubmit in filter if needed)
  const filtereBookings = bookings.filter((b) =>
  (b?.bookName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b?.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b?.dateOfIssue?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b?.dateOfSubmit?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // In NewBooking.tsx (simplified example)
  const handleCreateBooking = async () => {
    try {
      // 1. Create the booking first
      await createBooking({
        ...bookingData,
        SPN_NO: bookDetail.SPN_NO // From BooksList navigation state
      });

      // 2. Then update the book quantity
      await updateBook(bookDetail.id, {
        quantity: bookDetail.quantity - 1
      });

      // 3. Navigate back/refresh data
    } catch (error) {
      console.error("Booking failed:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Booking Details</h1>
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
              <th className="p-4 text-left">SPN_NO</th>
              <th className="p-4 text-left">Book Name</th>
              <th className="p-4 text-left">User Name</th>
              <th className="p-4 text-left">Date of Issue</th>
              <th className="p-4 text-left">Date of Submit</th>
              <th className="p-4 text-left">Price ($)</th>
              {<th className="p-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtereBookings.map((booking) => (
              <tr key={booking.id} className="border-t">
                <td className="p-4">{booking?.SPN_NO}</td>
                <td className="p-4">{booking.bookName}</td>
                <td className="p-4">{booking.userName}</td>
                <td className="p-4">{booking.dateOfIssue}</td>
                <td className="p-4">{booking.dateOfSubmit}</td>
                <td className="p-4">{booking.price}</td>
                {currentUser.isAdmin && (
                  <td className="p-4 text-right">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                      onClick={() => {
                        setEditBooking(booking);
                        setShowEditPopup(true);
                      }}
                    >
                      Update
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => setShowDeletePopup(booking.id)}
                    >
                      Return
                    </button>
                  </td>
                )}
                {
                  !currentUser.isAdmin &&
                  <td className="p-4">
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => setShowDeletePopup(booking.id)}
                    >
                      Return
                    </button>
                  </td>
                }
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Booking Popup */}
      {showEditPopup && editBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Booking</h2>
            <input
              type="text"
              value={editBooking.bookName}
              className="w-full border px-3 py-2 mb-4 rounded"
              onChange={(e) => setEditBooking({ ...editBooking, bookName: e.target.value })}
            />
            <input
              type="text"
              value={editBooking.userName}
              className="w-full border px-3 py-2 mb-4 rounded"
              onChange={(e) => setEditBooking({ ...editBooking, userName: e.target.value })}
            />
            <input
              type="date"
              value={editBooking.dateOfIssue}
              className="w-full border px-3 py-2 mb-4 rounded"
              onChange={(e) => setEditBooking({ ...editBooking, dateOfIssue: e.target.value })}
            />
            <input
              type="date"
              value={editBooking.dateOfSubmit}
              className="w-full border px-3 py-2 mb-4 rounded"
              onChange={(e) => setEditBooking({ ...editBooking, dateOfSubmit: e.target.value })}
            />
            <input
              type="number"
              value={editBooking.price}
              className="w-full border px-3 py-2 mb-4 rounded"
              onChange={(e) => setEditBooking({ ...editBooking, price: parseFloat(e.target.value) })}
            />
            <div className="flex justify-end">
              <button className="bg-gray-500 text-white px-4 py-2 rounded mr-2" onClick={() => setShowEditPopup(false)}>
                Cancel
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleUpdateBooking}>
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
            <p className="mb-6">Are you sure you want to delete this booking?</p>
            <div className="flex justify-end">
              <button className="bg-gray-500 text-white px-4 py-2 rounded mr-2" onClick={() => setShowDeletePopup(null)}>
                Cancel
              </button>
              <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleDeleteBooking}>
                Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDetails;
