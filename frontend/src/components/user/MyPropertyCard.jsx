import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axios";

function MyPropertyCard({ property, onDelete }) {
  const { _id, title, price, purpose, location, images } = property || {};
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const imageUrl = images?.[0]?.url || "/placeholder.jpg";


  const handleEdit = (e) => {
    e.stopPropagation();
    e.preventDefault();
    navigate(`/listing/update/${_id}`);
  };

  const handleOpenDeleteModal = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    setDeleting(true);

    try {
      await API.delete(`/listing/${_id}`);
      if (onDelete) {
        onDelete(_id);
      }
    } catch (err) {
      console.error("Failed to delete property:", err);
      alert(err.response?.data?.message || "Failed to delete property.");
    } finally {
      setDeleting(false);
      setShowConfirmModal(false);
    }
  };

  return (
    <>
      <div className="relative group bg-white/75 backdrop-blur-md border border-white/60 text-slate-800 rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col gap-3">
        
        <Link to={`/listing/${_id}`} className="block relative w-full h-44 rounded-xl overflow-hidden bg-slate-200">
          <img
            src={imageUrl}
            alt={title || "Property Image"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <span className="absolute top-2.5 left-2.5 bg-emerald-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            For {purpose || "Sale"}
          </span>
        </Link>

        <Link to={`/listing/${_id}`} className="flex flex-col gap-1">
          <h3 className="text-lg font-bold text-emerald-700">
            PKR {price ? price.toLocaleString() : "N/A"}
          </h3>
          <h2 className="text-sm font-semibold text-slate-800 line-clamp-1 group-hover:text-emerald-600 transition-colors">
            {title || "Untitled Property"}
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            📍 {location?.address ? `${location.address}, ` : ""}{location?.city || "Pakistan"}
          </p>
        </Link>

        <div className="flex gap-2 pt-2 border-t border-slate-200/80 mt-auto">
          <button
            onClick={handleEdit}
            className="flex-1 bg-slate-100 hover:bg-emerald-50 text-emerald-700 border border-slate-200 hover:border-emerald-300 font-semibold py-1.5 px-3 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
          >
            ✏️ Edit
          </button>
          <button
            onClick={handleOpenDeleteModal}
            className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/80 font-semibold py-1.5 px-3 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
          >
            🗑️ Delete
          </button>
        </div>
      </div>

      {showConfirmModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setShowConfirmModal(false);
          }}
        >
          <div
            className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full border border-slate-200 flex flex-col gap-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xl mx-auto">
              ⚠️
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-800">Delete Property?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete <span className="font-semibold text-slate-700">"{title}"</span>? This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={deleting}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-xl text-xs transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-xl text-xs transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MyPropertyCard;