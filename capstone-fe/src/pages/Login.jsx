import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login({ setToken, setIsLoggedIn }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users/login`,
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log(response);

      if (response.data.token && response.data.user) {
        // We received a valid token + user from the backend
        // setToken is optional if you want to store the token in a parent component
        setToken && setToken(response.data.token);

        try {
          // Store the token and user in localStorage so we can retrieve them later
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
        } catch (err) {
          console.error("Failed to save token/user:", err);
        }

        alert("Login Successful");

        // Set isLoggedIn to true immediately
        setIsLoggedIn(true);

        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    }
  }

  return (
    <div className="login_main_container">
      <h2>Login</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Username:{" "}
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label>
          Password:{" "}
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button>Submit</button>
      </form>
    </div>
  );
}

export default Login;
