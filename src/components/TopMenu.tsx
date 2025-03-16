"use client";

import { useState } from "react";
import Link from "next/link";

export default function TopBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo / Home Link */}
        <Link href="/" className="text-xl font-bold hover:text-gray-200">
          Home
        </Link>

        {/* Navigation Links */}
        <div className="space-x-4">
          {isLoggedIn ? (
            <button
              onClick={() => setIsLoggedIn(false)}
              className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 transition"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
