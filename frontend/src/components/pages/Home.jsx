import React from "react";
import { Link } from "react-router-dom";
import homeBg from "../../assets/homeBg.jpg";

function Home() {
  return (
    <div 
      className="h-[90vh] w-full flex flex-col justify-center px-6 md:px-16 bg-cover bg-center"
      style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.1)), url(${homeBg})` }}
    >
      <div className="max-w-2xl text-left">
        <h1 className="text-4xl md:text-6xl font-bold text-emerald-400 mb-4 leading-tight">
          Find Your Dream Home
        </h1>

        <p className="text-lg md:text-xl text-white mb-8">
          Search thousands of verified properties for sale and rent across Pakistan.
        </p>

        <Link
          to="/listings"
          className="inline-block bg-emerald-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-emerald-700 active:scale-95 transition-all shadow-md"
        >
          Explore Properties
        </Link>
      </div>
    </div>
  );
}

export default Home;