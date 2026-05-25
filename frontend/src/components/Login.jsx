// src/components/Login.jsx
import React, { useEffect, useState } from "react";
import "animate.css";
import starsImg from "../assets/img/stars2.png";
import { Link, useNavigate } from "react-router-dom";
import Snowfall from "./Snowfall";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      console.error("Google login error:", err);
      if (err.code === "auth/popup-blocked") {
        setError("Popup was blocked. Please allow popups and try again.");
      } else if (err.code === "auth/popup-closed-by-user") {
        setError("Login cancelled.");
      } else {
        setError(err.message || "Failed to login with Google");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      console.error("Email login error:", err);
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setError("Invalid email or password");
      } else {
        setError(err.message || "Failed to log in");
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

      <div className="form-container login-box">
        <p className="title">Login</p>
        
        {error && (
          <div className="alert alert-danger" style={{ marginBottom: "15px", borderRadius: "5px", padding: "10px" }}>
            {error}
          </div>
        )}

        <form className="form" onSubmit={handleEmailLogin}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input 
              type="text" 
              name="username" 
              id="username" 
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
            <div className="forgot">
              <a rel="noopener noreferrer" href="#">Forgot Password ?</a>
            </div>
          </div>
          <button className="sign btn btn-primary" type="submit" disabled={loading}>
            Sign in
          </button>
        </form>

        <button
          aria-label="Log in with Google"
          className="google-auth-button"
          onClick={handleGoogleLogin}
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
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
