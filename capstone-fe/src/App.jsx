import React from "react";
import { Routes, Route } from "react-router-dom";
import "./app.css";

import SidebarComponent from "./components/SidebarComponent";
import CommunitiesPage from "./pages/CommunitiesPage";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Messages from "./pages/Messages";
import SignUp from "./pages/SignUp";
import SingleCommunity from "./pages/SingleCommunity";
import CreateCommunityComponent from "./components/CreateCommunityComponent";
import UserProfile from "./pages/UserProfile";
import Users from "./pages/UsersDNU";
import TestPostContainer from "./components/TestPostContainer";

function App() {
  return (
    <>
      <SidebarComponent />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/communities" element={<CommunitiesPage />} />
        <Route path="/createCommunity" element={<CreateCommunityComponent />} />
        <Route path="/community/:communityId" element={<SingleCommunity />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/:username" element={<UserProfile />} />
        <Route path="/users" element={<Users />} />
        {/* Add a route to test PostContainerComponent */}
        <Route path="/test-posts" element={<TestPostContainer />} />
      </Routes>
    </>
  );
}

export default App;
