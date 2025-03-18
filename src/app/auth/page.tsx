"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    yearOfStudy: "",
    dob: "",
  });

  const router = useRouter();
  const { login } = useAuth();

  const handleChange = (e: { target: { name: string; value: string } }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!isLogin && (!formData.username || !formData.email || !formData.password || !formData.department || !formData.yearOfStudy || !formData.dob)) {
      alert("Please fill in all fields.");
      return;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Something went wrong");
    } else {
      alert(isLogin ? "Login successful!" : "Registration successful!");
      if (isLogin) {
        login(data.token);
        router.push("/");
      } else {
        setIsLogin(true);
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-gray-700 text-center">
          {isLogin ? "Login" : "Register"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-black">
          {!isLogin && (
            <div>
              <label className="block text-gray-600 text-sm font-medium">Username:</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={!isLogin}
              />
            </div>
          )}

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

          {!isLogin && (
            <div>
              <label className="block text-gray-600 text-sm font-medium">Confirm Password:</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={!isLogin}
              />
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="block text-gray-600 text-sm font-medium">Department:</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="" disabled>Select Department</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Engineering">Engineering</option>
                <option value="Business">Business</option>
                <option value="Medicine">Medicine</option>
                <option value="Arts">Arts</option>
              </select>
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="block text-gray-600 text-sm font-medium">Year of Study:</label>
              <select
                name="yearOfStudy"
                value={formData.yearOfStudy}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="" disabled>Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="block text-gray-600 text-sm font-medium">Date of Birth:</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setFormData({ username: "", email: "", password: "", confirmPassword: "", department: "", yearOfStudy: "", dob: "" });
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
