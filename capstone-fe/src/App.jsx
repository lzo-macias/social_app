// App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, Link, useParams, useNavigate } from "react-router-dom";
import "./App.css";

import SidebarComponent from "./components/SidebarComponent";
import CommunitiesPage from "./pages/CommunitiesPage";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Messages from "./pages/Messages";
import Users from "./components/UsersDNU";
import SignUp from "./pages/SignUp";
import SingleCommunity from "./pages/SingleCommunity";
import UserProfile from "./pages/UserProfile";
import CreateCommunityComponent from "./components/CommunityComponents/CreateCommunityComponent";
import PersonalPostComponent from "./components/PostComponents/PersonalPostComponent";
import SinglePostComponent from "./components/PostComponents/SinglePostComponent";
import MobileCommunitiesPage from "./pages/MobileCommunitiesPage";
import DirectMessage from "./components/MessageComponents/DirectMessage";
import MessageDashboard from "./components/MessageComponents/MessageDashboard";
import HeaderComponent from "./components/WhatAreThese/HeaderComponent";
import { buttonBaseClasses } from "@mui/material";

const DirectMessageWrapper = () => {
  const { senderUsername, receiverUsername } = useParams();
  return (
    <DirectMessage
      senderUsername={senderUsername}
      receiverUsername={receiverUsername}
    />
  );
};

function App() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

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

  const handlelogin = () => {
    navigate("/login")
  }
  
  const handleregister = () => {
    navigate("/signup")
  }
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    const isOnAuthPage = location.pathname === "/login" || location.pathname === "/signup";
  
    const handleClickAnywhere = () => {
      if (!token && !isOnAuthPage) {
        navigate("/login");
      }
    };
  
    document.addEventListener("click", handleClickAnywhere);
  
    return () => {
      document.removeEventListener("click", handleClickAnywhere);
    };
  }, [location.pathname, navigate]);
  
  return (
    <div className="container">
{location.pathname !== "/signup" &&
  location.pathname !== "/login" &&
  location.pathname !== "/createCommunity" && (
  <header className="header">
    <Link to="/" className="header-logo">
   
        Shenanigram

    </Link>
    <div className="header-content-wrapper">
      <HeaderComponent />
    </div>
  </header>
)}

      {location.pathname !== "/signup" &&
        location.pathname !== "/login" &&
        location.pathname !== "/createCommunity" && !isMobile && (
          <SidebarComponent searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        )}

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home searchTerm={searchTerm} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/communities" element={<CommunitiesPage />} />
          <Route path="/createCommunity" element={<CreateCommunityComponent />} />
          <Route path="/communities/:communityId" element={<SingleCommunity />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/:username/:userId" element={<UserProfile />} />
          <Route path="/users" element={<Users />} />
          <Route path="/album/:userId" element={<PersonalPostComponent />} />
          <Route path="/album/:userId/post/:postId" element={<SinglePostComponent />} />
          <Route path="/communitiesmobile" element={<MobileCommunitiesPage />} />
          <Route
            path="/direct-message/:senderUsername/:receiverUsername"
            element={<DirectMessageWrapper />}
          />
          <Route path="/messagedashboard" element={<MessageDashboard />} />
        </Routes>
      </main>

      {isMobile && <footer><SidebarComponent searchTerm={searchTerm} setSearchTerm={setSearchTerm} /></footer>}
    </div>
  );
}

export default App;
