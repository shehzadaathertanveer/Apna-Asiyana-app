import React from "react";
import { Link } from "react-router-dom";

function PropertyCard({ property }) {
  const { _id, title, price, purpose, location, images } = property || {};

  // Target the .url property inside the first object of the array
  const imageUrl = images?.[0]?.url || "/placeholder.jpg";

  return (
    <Link
      to={`/listing/${_id}`}
      className="group bg-white/75 backdrop-blur-md border border-white/60 text-black rounded-2xl p-4 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col gap-3"
    >
      <div className="relative w-full h-44 rounded-xl overflow-hidden bg-slate-200">
        <img
          src={imageUrl}
          alt={title || "Property Image"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute top-2.5 left-2.5 bg-emerald-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
          For {purpose || "Sale"}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-bold text-emerald-700">
          PKR {price ? price.toLocaleString() : "N/A"}
        </h3>
        <h2 className="text-sm font-semibold text-slate-800 line-clamp-1 group-hover:text-emerald-600 transition-colors">
          {title || "Untitled Property"}
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          📍 {location?.city || "Pakistan"}
        </p>
      </div>
    </Link>
  );
}

export default PropertyCard;