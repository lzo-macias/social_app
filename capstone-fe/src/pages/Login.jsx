import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login({ setToken }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/login`, // Corrected API route
        { username, password }, // Corrected request data
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.token) {
        setToken && setToken(response.data.token); // Ensure setToken exists
        try {
          localStorage.setItem("token", response.data.token);
        } catch (err) {
          console.error("Failed to save token:", err);
        }
        alert("Login Successful");
        navigate("/Home");
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
