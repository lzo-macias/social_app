import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dob, setDob] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/register`,
        {
          is_admin: false, // Default value
          username,
          email,
          password,
          dob, // Date of birth (from input)
          visibility: "public", // Default value
          profile_picture: "", // Empty for now
          bio,
          location,
          status: "active", // Default value
          created_at: new Date().toISOString(), // Auto-generated timestamp
        },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("API Response:", response.data);

      if (response.data.password) {
       //localStorage.setItem("token", response.data.token);
       //console.log("Token:", response.data.token);
        setSuccess(true);
        setFirstName("");
        setLastName("");
        setEmail("");
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setDob("");
        setBio("");
        setLocation("");
        alert("Registration Successful");
        navigate("/myprofile");
      }
    } catch (err) {
      console.error("Error response:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    }
  }

  return (
    <>
      <div className="signup_main_container">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <label>
            First Name:
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </label>
          <label>
            Last Name:
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </label>
          <label>
            Email:
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>
            Username:
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>
          <label>
            Password:
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <label>
            Confirm Password:
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {password && confirmPassword && (
              <p>{password === confirmPassword ? "Passwords match!" : "Passwords do not match"}</p>
            )}
          </label>
          <label>
            Date of Birth:
            <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
          </label>
          <label>
            Bio:
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
          </label>
          <label>
            Location:
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
          </label>
          <button type="submit">Submit</button>
        </form>
        {error && <p>{error}</p>}
      </div>
    </>
  );
}

export default SignUp;
