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
  const [confirmPassword, setConfirmPassword] = useState("")
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
        `${import.meta.env.VITE_API_BASE_URL}/users/register`,
        {
          firstname: firstName,  // API expects "firstname"
          lastname: lastName,    // API expects "lastname"
          email: email,
          password: password
        },
        { headers: { "Content-Type": "application/json" } }
      );
  
      console.log("API Response:", response.data);
  
      if (response.data.token) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        console.log("Token:", response.data.token);
        setSuccess(true);
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        alert ("Registration Successful")
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
            First Name: <input type="text" name = "firstName" value = {firstName} onChange={(e) => setFirstName(e.target.value)}/>
        </label>
        <label>
            Last Name: <input type="text" name = "lastName" value = {lastName} onChange = {(e) => setLastName(e.target.value)}/>
        </label>
        <label>
            Email: <input type="email" name = "email" value = {email} onChange = {(e) => setEmail(e.target.value)}/>
        </label>
        <label>
            Username: <input type="text" name = "username" value = {username} onChange = {(e) => setUsername(e.target.value)}/>
        </label>
        <label>
            Password: <input type="password" name = "password" value = {password} onChange = {(e) => setPassword(e.target.value)}/>
        </label>
        <label>
            Confirm Password: <input type="password" name = "confirmPassword" value = {confirmPassword} onChange = {(e) => setConfirmPassword(e.target.value)}/>
            {password && confirmPassword && (<p>{password === confirmPassword ? "Passwords match!" : "Passwords do not match"}</p>)}        
        </label>
        <button>Submit</button>
    </form>
    {error && <p>{error}</p>}
    </div>
</>
  )
}



export default SignUp