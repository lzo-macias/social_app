import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";

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
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if token exists in localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  return (
    <>
      <img src="../images/logo.png" alt="logo" />

      {/* Show Sidebar except on these routes
      {location.pathname !== "/signup" &&
        location.pathname !== "/login" &&
        location.pathname !== "/createCommunity" && <SidebarComponent />} */}

      {/* If user is logged out, show login/sign-up buttons */}
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

      <div className="login_logout_buttons">
        {/* 
          If you want a logout button for logged-in users, 
          you can uncomment and check `isLoggedIn` 
        */}
      </div>

      {/* ROUTES */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        {/* 1) List all communities */}
        <Route path="/communities" element={<CommunitiesPage />} />
        {/* 2) Create new community */}
        <Route path="/createCommunity" element={<CreateCommunityComponent />} />
        {/* 3) Single community details + posts */}
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
