// src/components/Signup.jsx
import React, { useEffect, useState } from "react";
import "animate.css";
import starsImg from "../assets/img/stars2.png";
import { Link, useNavigate } from "react-router-dom";
import Snowfall from "./Snowfall";
import { useAuth } from "../context/AuthContext";

function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { signup, signupWithGoogle } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      setError("");
      await signupWithGoogle();
      navigate("/onboarding");
    } catch (err) {
      console.error("Google signup error:", err);
      if (err.code === "auth/popup-blocked") {
        setError("Popup was blocked. Please allow popups and try again.");
      } else if (err.code === "auth/popup-closed-by-user") {
        setError("Sign up cancelled.");
      } else {
        setError(err.message || "Failed to sign up with Google");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await signup(email, password, fullName);
      navigate("/onboarding");
    } catch (err) {
      console.error("Email signup error:", err);
      if (err.code === "auth/email-already-in-use") {
        setError("Email already in use");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address");
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak");
      } else {
        setError(err.message || "Failed to create account");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Snowfall />
      {/* Background stars */}
      <img src={starsImg} alt="Stars" className="stars2-bg" />

      <div className="form-container login-box signup-box">
        <p className="title">Sign up</p>
        
        {error && (
          <div className="alert alert-danger" style={{ marginBottom: "15px", borderRadius: "5px", padding: "10px" }}>
            {error}
          </div>
        )}

        <form className="form" onSubmit={handleEmailSignup}>
          <div className="input-group">
            <label htmlFor="fullName">Full name</label>
            <input 
              type="text" 
              name="fullName" 
              id="fullName" 
              placeholder="" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              name="email" 
              id="email" 
              placeholder="" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              name="password" 
              id="password" 
              placeholder="" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm password</label>
            <input 
              type="password" 
              name="confirmPassword" 
              id="confirmPassword" 
              placeholder="" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button className="sign btn btn-primary" type="submit" disabled={loading}>
            Create account
          </button>
        </form>

        <button
          aria-label="Sign up with Google"
          className="google-auth-button"
          onClick={handleGoogleSignup}
          disabled={loading}
          type="button"
          title="Continue with Google"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="google-auth-icon" aria-hidden="true">
            <path d="M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z"></path>
          </svg>
          <span>Continue with Google</span>
        </button>

        <p className="signup">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
