"use client";

import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div>
      <div className=" bg-black py-3 px-5">
        <button
          className=" text-white relative flex w-full"
          onClick={toggleDropdown}
        >
          NAVIGATION
          <svg
            className="absolute right-0 mr-2 mt-1"
            width="20"
            height="20"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              transform: `rotate(${isOpen ? 360 : 270}deg)`,
              transition: "transform 0.2s ease",
            }}
          >
            <path
              d="M1.5 3.75L6 8.25L10.5 3.75"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      {isOpen && (
        <ul className="leading-loose text-blue-600">
          <li className="px-5 hover:text-red-500 border-b border-gray-400">
            <Link href="/">VIEW THE MAP</Link>
          </li>
          <li className="px-5 hover:text-red-500 border-b border-gray-400">
            <Link href="/">GET CRASH DATA</Link>
          </li>
          <li className="px-5 hover:text-red-500 border-b border-gray-400">
            <Link href="/">GET FATALITY DATA</Link>
          </li>
          <li className="px-5 hover:text-red-500 border-b border-gray-400">
            <Link href="/about">ABOUT</Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Navbar;
