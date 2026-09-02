import React from "react";
import { Link } from "react-router-dom";
import { optimizeImage } from "../../utils/imageHelper" 

function MyPropertyCard({ property, onDelete }) {
  const { _id, title, price, purpose, location, images } = property || {};

  const rawImageUrl = images?.[0]?.url || "/placeholder.jpg";
  const imageUrl = optimizeImage(rawImageUrl, 600); // Optimized for speed

  return (
    <div className="bg-white/75 backdrop-blur-md border border-white/65 text-slate-800 rounded-2xl p-4 shadow-md flex flex-col justify-between gap-3">
      <Link to={`/listing/${_id}`} className="relative w-full h-40 rounded-xl overflow-hidden bg-slate-200 block group">
        <img
          src={imageUrl}
          alt={title || "Property"}
          loading="lazy" // Lazy loading for speed
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
          For {purpose || "Sale"}
        </span>
      </Link>

      <div className="flex flex-col gap-1">
        <h3 className="text-base font-bold text-emerald-700">
          PKR {price ? price.toLocaleString() : "N/A"}
        </h3>
        <h4 className="text-xs font-semibold text-slate-800 line-clamp-1">
          {title || "Untitled Property"}
        </h4>
        <p className="text-[11px] text-slate-500">
          📍 {location?.city || "Pakistan"}
        </p>
      </div>

      {/* Add your edit/delete buttons here if they are part of this card */}
    </div>
  );
}

export default MyPropertyCard;