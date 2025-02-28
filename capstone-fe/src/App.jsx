import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import axios from "axios";
import "./app.css";

import Sidebar from "./components/SidebarComponent";
import Communities from "./pages/Communities";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Messages from "./pages/Messages";
import Users from "./pages/UsersDNU";
import SignUp from "./pages/SignUp";
import SingleCommunity from "./pages/SingleCommunity";
import MyProfile from "./pages/MyProfile";
import CreateCommunityPage from "./pages/CreateCommunityPage";

function App() {
  const location = useLocation(); // Hook for getting current location
  const [widgets, setWidgets] = useState([]); // Assuming you will fetch widgets data (optional)

  // Uncomment this block to fetch widgets data when needed
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
    <>
      {/* Conditionally render Sidebar, don't show on signup/login pages */}
      {location.pathname !== "/signup" && location.pathname !== "/login" && (
        <Sidebar /> /* Ensure Sidebar is used here */
      )}

      {/* Define all your routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/communities" element={<Communities />} />
        <Route path="/create-community" element={<CreateCommunityPage />} />
        <Route path="/contacts/communities/:id" element={<SingleCommunity />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/users" element={<Users />} />
        <Route path="*" element={<Home />} /> {/* Default route */}
      </Routes>
    </>
  );
}

export default App;
