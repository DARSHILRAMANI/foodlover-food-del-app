import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Add from "./pages/Add/Add";
import List from "./pages/List/List";
import Orders from "./pages/Orders/Orders";
import LoginPopup from "./components/login/LoginPopup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const token = localStorage.getItem("aToken");

  return (
    <div className="app">
      <ToastContainer />
      {token ? (
        <>
          <Navbar />
          <hr />
          <div className="app-content">
            <Sidebar />
            <Routes>
              <Route path="/add" element={<Add />} />
              <Route path="/list" element={<List />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="*" element={<Navigate to="/list" />} />
            </Routes>
          </div>
        </>
      ) : (
        <Routes>
          {/* Redirect to login if not authenticated */}
          <Route path="*" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPopup />} />
        </Routes>
      )}
    </div>
  );
};

export default App;
