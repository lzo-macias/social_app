// UsersDNU.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

function Users({ token }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((data) => {
        setUserData(data.data);
      })
      .catch((err) => console.log(err));
  }, [token]);

  return (
    <div className="card">
      <h2>Welcome, {userData?.username}</h2>
    </div>
  );
}

export default Users;
