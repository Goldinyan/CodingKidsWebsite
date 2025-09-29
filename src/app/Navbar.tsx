"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { user } from "@/lib/firebase";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className=" w-[50vw] ml-[25vw] justify-around hidden md:flex">
        <Link href="/">Home</Link>
        <Link href="/termine">Termine</Link>
        <Link href="/verein">Verein</Link>
        {!user ? (
          <Link href="/login">Login</Link>
        ) : (
          <Link href="/profile">Profile</Link>
        )}
      </div>
      <div className="flex md:hidden">
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-md bg-gray-800 text-white focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md z-50">
            <ul className="flex flex-col text-gray-800">
              <li>
                <Link href="/" className="px-4 py-2 hover:bg-gray-100 block">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/termine"
                  className="px-4 py-2 hover:bg-gray-100 block"
                >
                  Termine
                </Link>
              </li>
              <li>
                <Link
                  href="/verein"
                  className="px-4 py-2 hover:bg-gray-100 block"
                >
                  Verein
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="px-4 py-2 hover:bg-gray-100 block"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="px-4 py-2 hover:bg-gray-100 block"
                >
                  Profile
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
