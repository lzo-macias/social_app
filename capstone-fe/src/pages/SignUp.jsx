// SignUp.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  // ... other state variables
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users/register`,
        {
          firstName,
          // ... other fields
          password,
        }
      );
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        setSuccess(true);
        setError(null);
        alert("Registration Successful");
        navigate("/login");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
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
          First Name:
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </label>
        {/* Other input fields */}
        <button type="submit" disabled={loading} className="btn">
          {loading ? "Registering..." : "Submit"}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {success && (
        <p className="success-message">
          Registration successful! Please login.
        </p>
      )}
    </div>
  );
}

export default SignUp;
