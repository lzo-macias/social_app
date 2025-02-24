/* TODO - add your code to create a functional React component that renders a login form */
import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import {useNavigate} from "react-router-dom"


function Login({setToken}) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    
    async function handleSubmit(e){
        e.preventDefault();
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/users/login`,
            {
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
            setEmail("");
            setPassword("");
            alert ("Login Successful")
            navigate("/Home");
          }
        } catch (err) {
          console.error("Error response:", err.response?.data || err.message);
          setError(err.response?.data?.message || "Login failed. Please try again.");
        }
      }
    
return (
    <>
    <div className='login_main_container'>
        <h2>Login</h2>
        {error &&
            <p>{error}</p>
        }
        <form onSubmit={handleSubmit}>
            <label>
                Email: <input type="text" name = "email" value = {email} onChange={(e) => setEmail(e.target.value)}/>
            </label>
            <label>
                Password: <input type="password" name = "password" value = {password} onChange = {(e) => setPassword(e.target.value)}/>
            </label>
            <button>Submit</button>
        </form>
    </div>

    </>

)
}

export default Login