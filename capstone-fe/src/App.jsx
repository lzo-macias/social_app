import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import axios from "axios";
import "./app.css";

import SidebarComponent from "./components/SidebarComponent";
import Communities from "./pages/Communities";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Messages from "./pages/Messages";
// import Post from "./pages/Post";
import Users from "./pages/UsersDNU";
import SignUp from "./pages/SignUp";
import SingleCommunity from "./pages/SingleCommunity";
import UserProfile from "./pages/UserProfile";
// import CreateCommunityPage from "./pages/CreateCommunityPage";
import CreateCommunityComponent from "./components/CreateCommunityComponent";

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
    // selina users
    // darin chat and messaging features post
    // lorenzo header signup and login
    // kevin communities
    // tristan single communities
    <>
      {/* {location.pathname !== "/signup" && location.pathname !== "/login" && (
        <SidebarComponent />
      )} */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/communities" element={<Communities />} />
        <Route path="/createCommunity" element={<CreateCommunityComponent />} />
        {/* <Route path="/create-community" element={<CreateCommunityPage />} /> */}
        <Route path="/contacts/communities/:id" element={<SingleCommunity />} />
        <Route path="/messages" element={<Messages />} />
        {/* <Route path="/post" element={<Post />} /> */}
        <Route path="/:username" element={<UserProfile />} />
        <Route path="/users" element={<Users />} />
        {/* <Route path="*" element={<Home />} /> */}
      </Routes>
    </>
  );
}

export default App;
