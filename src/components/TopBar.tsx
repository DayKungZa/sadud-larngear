"use client";

import Link from "next/link";
import { useAuth } from "../app/context/AuthContext";

export default function TopBar() {
  const { isLoggedIn, logout } = useAuth();

  return (
    <nav className="bg-gray-800 text-white p-2 shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-lg font-bold hover:text-gray-200">
          Home
        </Link>

        {/* Navigation Links */}
        <div className="space-x-4">
          {isLoggedIn ? (
            <button
              onClick={logout}
              className="bg-red-500 px-4 py-1 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/auth"
              className="px-4 py-1 rounded-lg bg-green-500 hover:bg-green-600 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
