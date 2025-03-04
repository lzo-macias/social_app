import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom"; // Import useLocation
import "./app.css";

import SidebarComponent from "./components/SidebarComponent";
import CommunitiesPage from "./pages/CommunitiesPage";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Messages from "./pages/Messages";
import Users from "./pages/UsersDNU";
import SignUp from "./pages/SignUp";
import SingleCommunity from "./pages/SingleCommunity";
import UserProfile from "./pages/UserProfile";
import CreateCommunityComponent from "./components/CreateCommunityComponent";
import PersonalPostComponent from "./components/PostComponents/PersonalPostComponent";
import SinglePostComponent from "./components/PostComponents/SinglePostComponent";

function App() {
  const location = useLocation(); // Hook for getting current location
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if token exists in localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Set logged-in state based on token presence
  }, []);

  const handleLogout = () => {
    // Clear the token from localStorage and redirect to login page
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false); // Update the state
    window.location.href = "/"; // Redirect to home page
  };

  return (
    <>
      {/* Display the logo at the top */}
      <img src="../images/logo.png" alt="logo" />
      {location.pathname !== "/signup" &&
        location.pathname !== "/login" &&
        location.pathname !== "/createCommunity" && <SidebarComponent />}

      {/* If user is logged out (no token), show login/signup buttons and logout button */}
      {!isLoggedIn &&
        location.pathname !== "/signup" &&
        location.pathname !== "/login" && (
          <div className="login_logout_buttons">
            <button onClick={() => (window.location.href = "/login")}>
              Login
            </button>
            <button onClick={() => (window.location.href = "/signup")}>
              Sign Up
            </button>
          </div>
        )}

      {/* If logged in, show the sidebar and a logout button */}
      <div className="login_logout_buttons">
        {isLoggedIn && location.pathname !== "/signup" && location.pathname !== "/login" && (
        <>
          <button onClick={handleLogout} id="logout-btn">Logout</button>
        </>
      )}
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/communities" element={<CommunitiesPage />} />
        <Route path="/createCommunity" element={<CreateCommunityComponent />} />
        <Route path="/communities/:communityId" element={<SingleCommunity />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/:username" element={<UserProfile />} />
        <Route path="/users" element={<Users />} />
        {/* <Route path="*" element={<Home />} /> */}
        <Route path="/album/:userId" element={<PersonalPostComponent />} />
        <Route
          path="/album/:userId/post/:postId"
          element={<SinglePostComponent />}
        />
      </Routes>
    </>
  );
}

export default App;
