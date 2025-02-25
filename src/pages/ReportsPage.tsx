import React, {useState, useEffect} from "react";
import { getLastThreeUsers } from "../utils/auth.util.ts";
import { getLatestBooks } from "../utils/books.ts";
import { getLatestBookings } from "../utils/bookings.ts";
import { getCounts } from "../utils/helpers.ts";

const ReportsPage: React.FC = () => {
    const [bookingsData, setBookingsData] = useState([])
    const [usersData, setUserData] = useState([])
    const [booksData, setBooksData] = useState([])
    const [counts, setCounts] = useState()

    const currentUser = JSON.parse(localStorage.getItem("adminUser") || "{}");

    const getAllStats = async () =>{
        try{
            const resp = await getCounts();
            setCounts(resp)
            // console.log(resp)
        }catch(err){
            console.log(err)
        }
    }

    const fetchLatestBookings = async () =>{
        try{
            const resp = await getLatestBookings(currentUser);
            setBookingsData(resp)
            // console.log(resp)
        }catch(err){
            console.log(err)
        }
    }

    const fetchLatestUsers = async () =>{
        try{
            const resp = await getLastThreeUsers();
            // console.log(resp)
            setUserData(resp)
        }catch(err){
            console.log(err)
        }
    }

    const fetchLatestBooks = async () =>{
        try{
            const resp = await getLatestBooks()
            // console.log('lates', resp)
            setBooksData(resp)
        }catch(err){
            console.log(err)
        }
    }

    useEffect(()=>{
        fetchLatestUsers();
        fetchLatestBooks();
        fetchLatestBookings();
        getAllStats();
    },[])


  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Reports</h1>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Bookings */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700">Total Bookings</h2>
          <p className="text-3xl font-bold text-blue-500">{counts?.bookingsCount}</p>
        </div>

        {/* Total Users */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700">Total Users</h2>
          <p className="text-3xl font-bold text-green-500">{counts?.usersCount}</p>
        </div>

        {/* Total Books */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700">Total Books</h2>
          <p className="text-3xl font-bold text-purple-500">{counts?.booksCount}</p>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Bookings</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">Book Name</th>
              <th className="py-2">User Name</th>
              <th className="py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {bookingsData.map((booking) => (
              <tr key={booking.id} className="border-b hover:bg-gray-50">
                <td className="py-3">{booking?.bookName}</td>
                <td className="py-3">{booking?.userName}</td>
                <td className="py-3">{booking?.dateOfIssue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Users Table */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Added Users</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">Name</th>
              <th className="py-2">Email</th>
              <th className="py-2">Role</th>
            </tr>
          </thead>
          <tbody>
            {usersData.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="py-3">{user?.displayName}</td>
                <td className="py-3">{user?.email}</td>
                <td className="py-3">{user?.role === 'isAdmin' ? 'Admin' : "User"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Books Table */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Latest Added Books</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">Title</th>
              <th className="py-2">Author</th>
              <th className="py-2">Available</th>
            </tr>
          </thead>
          <tbody>
            {booksData.map((book) => (
              <tr key={book.id} className="border-b hover:bg-gray-50">
                <td className="py-3">{book?.name}</td>
                <td className="py-3">{book?.author}</td>
                <td className="py-3">{book?.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsPage;