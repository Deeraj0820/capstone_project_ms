import React, {useState, useEffect} from "react";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout.tsx";
import BarChart from "../components/charts/BarChart.tsx";
import LineChart from "../components/charts/LineChart.tsx";
import AllUsers from "./Users.tsx";
import AddUser from "./Adduser.tsx";
import BooksList from "./BooksList.tsx";
import BookingDetails from "./BookingDetails.tsx";
import AddBooking from "./AddBooking.tsx";
import  ChatSection  from "./ChatSection.tsx";
import Library from "./Library.tsx";
import BookDetail from "./BookDetails.tsx";
import GroupChats from "./GroupChat.tsx";
import ProfileUpdateForm from "./UpdateProfileForm.tsx";
import NotificationPage from "./NotificationPage.tsx";
import ReportsPage from "./ReportsPage.tsx";
import { getCounts } from "../utils/helpers.ts";
import ContactDetailsPage from "./ContactDetails.tsx";
import { getMonthlyRevenue } from "../utils/bookings.ts";
import Remainders from "./Remainders.tsx";
import BookDetails from "./BookDetailsPage.tsx";

// Dashboard Components
const DashboardHome = () => {
  const [counts, setCounts] = useState()
  const [revenue, setRevenue] = useState(0) 

  const getRevenue = async () =>{
    try{
      const response = await getMonthlyRevenue();
      // console.log(response)
      setRevenue(response)
    }catch(err){
      console.log(err)
    }
  }

  useEffect(()=>{
    const getAllCounts = async () =>{
      try{
        const resp = await getCounts();
        setCounts(resp)
      }catch(err){
        console.log(err)
      }
    }
    getAllCounts();
    getRevenue();
  },[])

  return (
  <div className="space-y-6">
    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Total Users</h3>
        <p className="text-3xl font-bold text-blue-600">{counts?.usersCount}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Monthly Revenue</h3>
        <p className="text-3xl font-bold text-green-600">$ {revenue?.totalRevenue}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Available books</h3>
        <p className="text-3xl font-bold text-purple-600">{counts?.booksCount}</p>
      </div>
    </div>

    {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <BarChart />
      <LineChart />
    </div>
  </div>
  )
};

const UserManagement = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-xl font-semibold mb-4">User Management</h2>
    <p>User management content goes here</p>
  </div>
);

const Settings = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-xl font-semibold mb-4">Settings</h2>
    <p>Settings content goes here</p>
  </div>
);

const UsersList = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-xl font-semibold mb-4">All Users</h2>
    {/* Add users list component */}
  </div>
);

// const AddUser = () => (
//   <div class="bg-white rounded-lg shadow p-6">
//     <h2 class="text-xl font-semibold mb-4">Add New User</h2>
//     {/* Add user form component */}
//   </div>
// );

const UserRoles = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-xl font-semibold mb-4">User Roles</h2>
    {/* Add roles management component */}
  </div>
);

const Dashboard = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        {/* <Route path="/users/all" element={<UsersList />} /> */}
        <Route path="/users/all" element={<AllUsers />} />
        {/* <Route path="/users/add" element={<AddUser />} /> */}
        <Route path="/users/add" element={<AddUser />} />
        <Route path="/users/roles" element={<UserRoles />} />
        <Route path="/books/all" element={<BooksList />} />
        <Route path="/bookings/all" element={<BookingDetails />} />
        <Route path="/bookings/new" element={<AddBooking />} />
        <Route path="/settings/*" element={<Settings />} />
        <Route path="/chat" element={<ChatSection />} />
        <Route path="/groups" element={<GroupChats />} />
        <Route path="/library" element={<Library />} />
        <Route path="/book/:id" element={<BookDetails />} />
        <Route path="/details" element={<BookDetail />} />
        <Route path="/profile" element={<ProfileUpdateForm />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/contact/details" element={<ContactDetailsPage />} />
        <Route path="/remainders" element={<Remainders />} />
        {/* Add more routes as needed */}
      </Routes>
    </DashboardLayout>
  );
};

export default Dashboard;
