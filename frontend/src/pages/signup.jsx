import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api.js";

export default function SignUp() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const validateName = (name) => {
    if (!name.trim()) return "This field is required";
    if (name.trim().length < 2) return "Must be at least 2 characters";
    if (name.trim().length > 50) return "Must be less than 50 characters";
    if (!/^[a-zA-Z\s'-]+$/.test(name))
      return "Only letters, spaces, hyphens and apostrophes allowed";
    return "";
  };

  const validateEmail = (email) => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    if (email.length > 254) return "Email is too long";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (password.length > 128) return "Password is too long";
    return "";
  };

  const validateRole = (role) => {
    const validRoles = ["patient", "doctor", "health_worker", "ngo"];
    if (!role) return "Please select a role";
    if (!validRoles.includes(role)) return "Please select a valid role";
    return "";
  };

  const validateField = (name, value) => {
    switch (name) {
      case "firstName":
      case "lastName":
        return validateName(value);
      case "email":
        return validateEmail(value);
      case "password":
        return validatePassword(value);
      case "role":
        return validateRole(value);
      default:
        return "";
    }
  };

  const validateForm = () => {
    const errors = {};
    Object.keys(form).forEach((field) => {
      const error = validateField(field, form[field]);
      if (error) errors[field] = error;
    });
    return errors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");

    const fieldError = validateField(e.target.name, e.target.value);
    setFieldErrors((prev) => ({
      ...prev,
      [e.target.name]: fieldError,
    }));
  };

  const handleBlur = (e) => {
    const fieldError = validateField(e.target.name, e.target.value);
    setFieldErrors((prev) => ({
      ...prev,
      [e.target.name]: fieldError,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("Please fix the errors above");
      setLoading(false);
      return;
    }

    try {
      const submitData = {
        ...form,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
      };

      const res = await api.post("/auth/signup", submitData);
      const { user, tokens } = res.data.data || {};

      if (tokens?.accessToken) {
        localStorage.setItem("token", tokens.accessToken);
      }

      if (user) {
        localStorage.setItem("userRole", user.role);
        localStorage.setItem("userId", user.id);
        localStorage.setItem("firstName", user.firstName || "");
        localStorage.setItem("lastName", user.lastName || "");
      }

      navigate("/profile", {
        state: { message: "Account created successfully!" },
      });
    } catch (err) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-500">Join the WellNest community</p>
        </div>

        {error && (
          <div className="mb-4 rounded bg-red-100 p-3 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name *
            </label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your first name"
              maxLength="50"
              className={`mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 ${
                fieldErrors.firstName
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {fieldErrors.firstName && (
              <p className="mt-1 text-sm text-red-600">
                {fieldErrors.firstName}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name *
            </label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your last name"
              maxLength="50"
              className={`mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 ${
                fieldErrors.lastName
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {fieldErrors.lastName && (
              <p className="mt-1 text-sm text-red-600">
                {fieldErrors.lastName}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your email"
              maxLength="254"
              className={`mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 ${
                fieldErrors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {fieldErrors.email && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Create a password"
              maxLength="128"
              className={`mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 ${
                fieldErrors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            <p className="mt-1 text-xs text-gray-500">
              Password must be at least 6 characters long
            </p>
            {fieldErrors.password && (
              <p className="mt-1 text-sm text-red-600">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              I am a... *
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 ${
                fieldErrors.role
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            >
              <option value="">Select your role</option>
              <option value="patient">user</option>
              {/* <option value="doctor">admin</option> */}
            </select>
            {fieldErrors.role && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.role}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={
              loading ||
              Object.keys(fieldErrors).some((key) => fieldErrors[key])
            }
            className="w-full rounded-md bg-blue-600 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="font-medium text-blue-600 hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
