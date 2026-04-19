import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api.js";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/users/profile");
        setUser(res.data); // adjust if your response structure differs
      } catch (err) {
        setError("Failed to load profile");

        // If unauthorized, redirect to signin
        if (err.response?.status === 401) {
          navigate("/signin");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    localStorage.clear();
    try {
      const res = await api.post("/api/auth/logout");
      if (res.status === 200) {
        console.log(res.data.message || "Logout successful");
      } else {
        console.log("Logout failed with status:", res.status);
      }
    } catch (err) {
      console.log("Logout API call failed", err);
    }
    navigate("/signin");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
          <p className="text-gray-500">Welcome to your dashboard</p>
        </div>

        <div className="space-y-4">
          <div className="rounded-md bg-gray-50 p-3">
            <p className="text-sm text-gray-500">First Name</p>
            <p className="font-medium text-gray-800">{user?.firstName}</p>
          </div>

          <div className="rounded-md bg-gray-50 p-3">
            <p className="text-sm text-gray-500">Last Name</p>
            <p className="font-medium text-gray-800">{user?.lastName}</p>
          </div>

          <div className="rounded-md bg-gray-50 p-3">
            <p className="text-sm text-gray-500">Role</p>
            <p className="font-medium text-gray-800 capitalize">{user?.role}</p>
          </div>

          <div className="rounded-md bg-gray-50 p-3">
            <p className="text-sm text-gray-500">User ID</p>
            <p className="font-medium text-gray-800">{user?.userId}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 w-full rounded-md bg-red-500 py-2 font-medium text-white transition hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
