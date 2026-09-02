import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import homeLogo from "../assets/home_logo.jpg";

function Footer() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <footer className="bg-slate-900 text-slate-300 pt-10 pb-6 px-6 border-t border-slate-800 mt-auto">

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <img
              src={homeLogo}
              alt="logo"
              className="w-10 h-10 rounded-xl object-cover"
            />
            <h2 className="text-xl font-bold text-emerald-400">
              Apna Ashiyana
            </h2>
          </div>
          <p className="text-slate-400 text-sm font-medium">
            A place where dreams come true. Pakistan's trusted real estate marketplace.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-white font-semibold text-lg mb-1">Quick Links</h3>
          <Link to="/" className="hover:text-emerald-400 transition-colors text-sm">Home</Link>
          <Link to="/listings" className="hover:text-emerald-400 transition-colors text-sm">Properties</Link>
          <Link to={isAuthenticated ? "/listing/new" : "/login"} className="hover:text-emerald-400 transition-colors text-sm">
            List Your Property
          </Link>
          <Link to="/contact" className="hover:text-emerald-400 transition-colors text-sm">Contact Us</Link>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-white font-semibold text-lg mb-1">Popular Cities</h3>
          <p className="text-sm text-slate-400 hover:text-white cursor-pointer">Find houses in Lahore</p>
          <p className="text-sm text-slate-400 hover:text-white cursor-pointer">Find houses in Karachi</p>
          <p className="text-sm text-slate-400 hover:text-white cursor-pointer">Find houses in Islamabad</p>
          <p className="text-sm text-slate-400 hover:text-white cursor-pointer">Find houses in Peshawar</p>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-white font-semibold text-lg mb-1">Get in Touch</h3>
          <p className="text-sm text-slate-400">Email: apnaashiyanaaa@gmail.com</p>
          <p className="text-sm text-slate-400">Ph: +92 3XX XXXXXXX</p>
          <p className="text-sm text-slate-400">Office: Lahore, Pakistan</p>
        </div>

      </div>

      <div className="border-t border-slate-800 mt-8 pt-4 text-center">
        <p className="text-slate-500 font-medium text-xs">
          © {new Date().getFullYear()} Apna Ashiyana. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;