import React, { useEffect, useState } from "react";
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

function App() {
  const [widgets, setWidgets] = useState([]);
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/widgets`)
      .then((data) => {
        console.log(data.data);
        setWidgets(data.data);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/communities" element={<Communities />} />
        <Route path="/contacts/communities/:id" element={<SingleCommunity />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/post" element={<Post />} />
        <Route path="/api/profile" element={<Users />} />
      </Routes>
    </>
  );
}

export default App;
