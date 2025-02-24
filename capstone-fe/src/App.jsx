import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import Header from "./components/Header";
import Communities from "./pages/Communities";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Messages from "./pages/Messages";
import Post from "./pages/Post";
import Users from "./pages/Users";
import SignUp from "./pages/SignUp";
import SingleCommunity from "./pages/SingleCommunity";
import CreateCommunityPage from "./pages/CreateCommunityPage";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/communities" element={<Communities />} />
        <Route path="/create-community" element={<CreateCommunityPage />} />
        <Route path="/contacts/communities/:id" element={<SingleCommunity />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/post" element={<Post />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </>
  );
}

export default App;
