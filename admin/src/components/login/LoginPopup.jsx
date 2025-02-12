import React, { useState } from "react";
import "./LoginPopup.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LoginPopup = () => {
  const ADMIN_ID = "admin@example.com";
  const PASSWORD = "12345678";

  const [data, setData] = useState({
    email: "admin@example.com",
    password: "12345678",
  });

  const navigate = useNavigate();

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onLogin = async (e) => {
    e.preventDefault();
    try {
      if (data.email !== ADMIN_ID || data.password !== PASSWORD) {
        toast.error("Invalid Details");
        return;
      }

      localStorage.setItem("aToken", "qwerrgererfdsfdfdsfresddfasfewfdf");
      toast.success("Admin Login successful");
      window.location.reload();

      // Use a timeout to ensure the toast message is visible before navigation
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>Admin Login</h2>
        </div>
        <div className="login-popup-inputs">
          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Admin ID"
            required
          />
          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder="Password"
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPopup;
