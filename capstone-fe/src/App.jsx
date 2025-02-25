import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import axios from "axios";
import "./app.css"

import Header from "./components/Header";
import Communities from "./pages/Communities";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Messages from "./pages/Messages";
import Post from "./pages/Post";
import Users from "./pages/Users";
import SignUp from "./pages/SignUp";
import SingleCommunity from "./pages/SingleCommunity";
import MyProfile from "./pages/myProfile";
import CreateCommunityPage from "./pages/CreateCommunityPage";

function App() {
  const location = useLocation();
  const [widgets, setWidgets] = useState([]);
  // useEffect(() => {
  //   axios
  //     .get(`${import.meta.env.VITE_API_BASE_URL}/api/widgets`)
  //     .then((data) => {
  //       console.log(data.data);
  //       setWidgets(data.data);
  //     })
  //     .catch((err) => console.log(err));
  // }, []);
  return (
    // selina users
    // darin chat and messaging features post
    // lorenzo header signup and login
    // kevin communities
    // tristan single communities
    <>
    {location.pathname !== '/signup' && location.pathname !== '/login' && <Header />}
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/communities" element={<Communities />} />
        <Route path="/create-community" element={<CreateCommunityPage />} />
        <Route path="/contacts/communities/:id" element={<SingleCommunity />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/post" element={<Post />} />
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/users" element={<Users />} /> 
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
