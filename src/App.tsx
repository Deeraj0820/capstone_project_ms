import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import Homepage from "./pages/Homepage.tsx";
import Library from "./pages/Library.tsx";
import ContactForm from "./pages/Contact.tsx";
import GroupChats from "./pages/GroupChat.tsx";
import BookDetailsPage from "./pages/BookDetailsPage.tsx";

const App = () => {
// const [showChat, setShowChat] = useState(false)
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Homepage />} />
          <Route path="/book/:id" element={<BookDetailsPage />} />
          <Route path="/contact" element={<ContactForm />} />
          <Route path="/library" element={<Library />} />
          {/* <Route path="/dashboard/groups" element={<GroupChats />} /> */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
