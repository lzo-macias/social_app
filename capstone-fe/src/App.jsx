import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, Link } from "react-router-dom";
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

      {/* Show Sidebar except on these routes */}
      {location.pathname !== "/signup" &&
        location.pathname !== "/login" &&
        location.pathname !== "/createCommunity" && <SidebarComponent />}

      {/* If user is logged out, show login/sign-up buttons */}
      {!isLoggedIn &&
        location.pathname !== "/signup" &&
        location.pathname !== "/login" && (
          <div className="login_logout_buttons">
            <Link to="/login">Log-In</Link>
            <Link to="/signup">Sign-Up</Link>
          </div>
        )}

      <div className="login_logout_buttons">
        {isLoggedIn &&
          location.pathname !== "/signup" &&
          location.pathname !== "/login" && (
            <>
              <button onClick={handleLogout} id="logout-btn">
                Logout
              </button>
            </>
          )}
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route path="/communities" element={<CommunitiesPage />} />
        <Route path="/createCommunity" element={<CreateCommunityComponent />} />
        <Route path="/communities/:communityId" element={<SingleCommunity />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/:username/:userId" element={<UserProfile />} />
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
