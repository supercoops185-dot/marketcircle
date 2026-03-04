import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Feed from "./pages/Feed";
import VendorPage from "./pages/VendorPage";
import MarketPage from "./pages/MarketPage";
import Dashboard from "./pages/Dashboard";
import ApplyVendor from "./pages/ApplyVendor";
import ApplyOrganizer from "./pages/ApplyOrganizer";
import Discover from "./pages/Discover";
import Profile from "./pages/Profile";

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { currentUser } = useAuth();
  return !currentUser ? children : <Navigate to="/feed" />;
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/feed" element={<PrivateRoute><Feed /></PrivateRoute>} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/vendor/:id" element={<VendorPage />} />
        <Route path="/market/:id" element={<MarketPage />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/apply/vendor" element={<PrivateRoute><ApplyVendor /></PrivateRoute>} />
        <Route path="/apply/organizer" element={<PrivateRoute><ApplyOrganizer /></PrivateRoute>} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}
