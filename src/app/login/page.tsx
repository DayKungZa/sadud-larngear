"use client";

import { useState } from "react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login & Register
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "", // Added for Register
  });

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      alert("Please fill in all fields.");
      return;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log(isLogin ? "Logging in..." : "Registering...", formData);
    alert(isLogin ? "Login successful!" : "Registration successful!");
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-gray-700 text-center">
          {isLogin ? "Login" : "Register"}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Email Input */}
          <div>
            <label className="block text-gray-600 text-sm font-medium">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-gray-600 text-sm font-medium">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Confirm Password (Only in Register) */}
          {!isLogin && (
            <div>
              <label className="block text-gray-600 text-sm font-medium">Confirm Password:</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        {/* Toggle Between Login & Register */}
        <p className="text-center text-sm text-gray-600 mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setFormData({ email: "", password: "", confirmPassword: "" }); // Reset fields when switching
            }}
            className="text-blue-500 hover:underline"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}