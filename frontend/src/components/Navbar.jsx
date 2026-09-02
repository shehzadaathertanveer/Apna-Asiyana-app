import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import homeLogo from "../assets/home_logo.jpg";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <nav className="bg-slate-900/80 backdrop-blur-md text-white sticky top-0 z-50 px-4 sm:px-6 py-4 border-b border-slate-800/50">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img
            src={homeLogo}
            alt="logo"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover"
          />
          <h1 className="text-lg sm:text-xl font-bold text-emerald-400">
            Apna Ashiyana
          </h1>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="hover:text-emerald-400 transition-colors">
            Home
          </Link>
          <Link to="/listings" className="hover:text-emerald-400 transition-colors">
            Properties
          </Link>
          <Link
            to={isAuthenticated ? "/listing/new" : "/login"}
            className="hover:text-emerald-400 transition-colors"
          >
            List Your Property
          </Link>
          <Link to="/contact" className="hover:text-emerald-400 transition-colors">
            Contact Us
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link
            to={isAuthenticated ? "/me" : "/login"}
            className="bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-emerald-700 active:scale-95 transition-all shadow-md"
          >
            {isAuthenticated
              ? `${user?.firstName || "User"}'s Profile`
              : "Get Started"}
          </Link>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-2xl font-bold p-1 focus:outline-none text-slate-300 hover:text-white"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {isOpen && (
        <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-slate-800 md:hidden text-sm font-medium">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="py-1.5 hover:text-emerald-400 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/listings"
            onClick={() => setIsOpen(false)}
            className="py-1.5 hover:text-emerald-400 transition-colors"
          >
            Properties
          </Link>
          <Link
            to={isAuthenticated ? "/listing/new" : "/login"}
            onClick={() => setIsOpen(false)}
            className="py-1.5 hover:text-emerald-400 transition-colors"
          >
            List Your Property
          </Link>
          <Link
            to="/contact"
            onClick={() => setIsOpen(false)}
            className="py-1.5 hover:text-emerald-400 transition-colors"
          >
            Contact Us
          </Link>

          <div className="pt-2 border-t border-slate-800/80">
            <Link
              to={isAuthenticated ? "/me" : "/login"}
              onClick={() => setIsOpen(false)}
              className="bg-emerald-600 text-white block py-2.5 rounded-lg text-center font-medium hover:bg-emerald-700 active:scale-95 transition-all shadow-md"
            >
              {isAuthenticated
                ? `${user?.firstName || "User"}'s Profile`
                : "Get Started"}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;