import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(""); // ✅ Updated field
  const [email, setEmail] = useState(""); // ✅ Added email
  const [dob, setDob] = useState(""); // ✅ Added Date of Birth (required)
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users/register`, // ✅ Correct API route
        {
          username, // ✅ Ensures this matches backend
          email,
          dob,
          bio,
          location,
          password,
        }
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        setSuccess(true);
        alert("Registration Successful");
        navigate("/login");
      }
    } catch (err) {
      setError(
        err.response?.data?.error || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="signup_main_container card">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username: 
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required
          />
        </label>

        <label>
          Email: 
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
          />
        </label>

        <label>
          Date of Birth:
          <input 
            type="date" 
            value={dob} 
            onChange={(e) => setDob(e.target.value)} 
            required
          />
        </label>

        <label>
          Bio: 
          <textarea 
            value={bio} 
            onChange={(e) => setBio(e.target.value)}
          />
        </label>

        <label>
          Location: 
          <input 
            type="text" 
            value={location} 
            onChange={(e) => setLocation(e.target.value)}
          />
        </label>

        <label>
          Password: 
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
          />
        </label>

        <label>
          Confirm Password: 
          <input 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required
          />
        </label>

        <button type="submit" disabled={loading} className="btn">
          {loading ? "Registering..." : "Submit"}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">Registration successful! Please login.</p>}
    </div>
  );
}

export default SignUp;
