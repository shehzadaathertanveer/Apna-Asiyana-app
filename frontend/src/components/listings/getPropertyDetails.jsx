import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";

function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchDetails() {
      try {
        setLoading(true);
        const res = await API.get(`/listing/${id}`);
        const data = res.data?.listing || res.data;
        setListing(data);
        setIsFavorite(data?.isFavorite || false);
      } catch (err) {
        console.error("Error fetching listing details:", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchDetails();
  }, [id]);

  const handleToggleFavorite = async () => {
    try {
      setFavLoading(true);
      const response = await API.put("/me/favorites", { listingId: id });
      if (response.data?.isFavorite !== undefined) {
        setIsFavorite(response.data.isFavorite);
      } else {
        setIsFavorite((prev) => !prev);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    } finally {
      setFavLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-teal-50 to-slate-100 flex items-center justify-center p-4">
        <p className="text-emerald-700 font-bold text-base sm:text-lg animate-pulse">
          Loading property details...
        </p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-teal-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center p-6 sm:p-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/60 max-w-xs sm:max-w-sm">
          <h2 className="text-lg sm:text-xl font-bold text-slate-800">Property Not Found</h2>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            The listing you are looking for does not exist or was removed.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  const { title, price, description, purpose, propertyType, location, features, images = [], user, owner } = listing;

  // Resolves seller/agent data across different backend object schemas
  const seller = owner || user || {};
  const sellerName = seller.firstName 
    ? `${seller.firstName} ${seller.lastName || ""}` 
    : seller.name || "Property Agent";
  
  const sellerPhone = seller.phoneNumber || seller.phone || seller.contactNumber || "";

  const handleNextImage = (e) => {
    e?.stopPropagation();
    setActiveImg((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (e) => {
    e?.stopPropagation();
    setActiveImg((prev) => (prev - 1 + images.length) % images.length);
  };

  const activeImageUrl = images?.[activeImg]?.url || images?.[activeImg] || "/placeholder.jpg";

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-teal-50 to-slate-100 p-3 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-4 sm:gap-6">
        
        {/* Navigation Bar */}
        <div className="flex justify-between items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-white/75 backdrop-blur-md border border-white/60 px-3 sm:px-3.5 py-2 rounded-xl hover:bg-white transition-all shadow-sm cursor-pointer"
          >
            ← Back
          </button>

          <button
            onClick={handleToggleFavorite}
            disabled={favLoading}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 sm:px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer ${
              isFavorite
                ? "bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100"
                : "bg-white/75 backdrop-blur-md border border-white/60 text-slate-700 hover:bg-white hover:text-emerald-700"
            }`}
          >
            {isFavorite ? "❤️ Favorited" : "🤍 Add to Favorites"}
          </button>
        </div>

        {/* Gallery & Agent Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          
          <div className="md:col-span-2 bg-white/75 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-white/60 shadow-xl flex flex-col gap-3">
            <div
              onClick={() => setIsModalOpen(true)}
              className="relative w-full h-60 sm:h-80 md:h-96 rounded-xl overflow-hidden bg-slate-900 group cursor-pointer"
            >
              <img
                src={activeImageUrl}
                alt={title || "Property Image"}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
              />

              <div className="absolute top-2.5 left-2.5 flex gap-1.5 sm:gap-2">
                <span className="bg-emerald-600 text-white text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 rounded-full shadow-md">
                  For {purpose || "Sale"}
                </span>
                {propertyType && (
                  <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] sm:text-xs font-medium px-2.5 sm:px-3 py-1 rounded-full shadow-md">
                    {propertyType}
                  </span>
                )}
              </div>

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 bg-slate-900/60 hover:bg-slate-900 text-white w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center backdrop-blur-sm transition-all shadow-md text-xs sm:text-sm cursor-pointer"
                  >
                    ❮
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-slate-900/60 hover:bg-slate-900 text-white w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center backdrop-blur-sm transition-all shadow-md text-xs sm:text-sm cursor-pointer"
                  >
                    ❯
                  </button>
                </>
              )}

              {images.length > 0 && (
                <span className="absolute bottom-2.5 right-2.5 bg-slate-900/70 text-white text-[10px] sm:text-xs px-2 sm:px-2.5 py-1 rounded-md backdrop-blur-sm font-medium">
                  {activeImg + 1} / {images.length}
                </span>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 pt-0.5">
                {images.map((img, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveImg(index)}
                    className={`relative min-w-[60px] sm:min-w-[70px] h-14 sm:h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                      activeImg === index
                        ? "border-emerald-600 scale-95 shadow-md"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img?.url || img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pricing & Contact Side */}
          <div className="bg-white/75 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-white/60 shadow-xl flex flex-col justify-between gap-4">
            <div>
              <span className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider">Asking Price</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-0.5">
                PKR {price ? price.toLocaleString() : "N/A"}
              </h1>
              <p className="text-xs text-slate-500 mt-1.5 font-medium flex items-center gap-1">
                📍 {location?.address ? `${location.address}, ` : ""}{location?.city || "Pakistan"}
              </p>
            </div>

            <div className="border-t border-slate-200/80 pt-4">
              <h3 className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">Listed By</h3>
              <div className="flex items-center gap-3 mb-3.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-emerald-600 text-white font-bold rounded-full flex items-center justify-center text-xs sm:text-sm shadow-md shrink-0">
                  {sellerName.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden min-w-0">
                  <h4 className="font-bold text-slate-800 text-xs sm:text-sm truncate">
                    {sellerName}
                  </h4>
                  <p className="text-[11px] text-slate-500">Apna Ashiyana Member</p>
                </div>
              </div>

              {/* Display phone number explicitly + phone action button */}
              {sellerPhone ? (
                <div className="flex flex-col gap-2">
                  <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-2.5 text-center">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Seller Contact</span>
                    <span className="text-sm sm:text-base font-bold text-emerald-800 tracking-wide">
                      {sellerPhone}
                    </span>
                  </div>

                  <a
                    href={`tel:${sellerPhone}`}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold py-2.5 rounded-xl transition-all shadow-md text-center block active:scale-95 cursor-pointer"
                  >
                    📞 Call Seller
                  </a>
                </div>
              ) : (
                <div className="bg-slate-100 border border-slate-200 text-slate-500 text-xs text-center py-2.5 rounded-xl font-medium">
                  Contact Number Not Provided
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Specifications & Description */}
        <div className="bg-white/75 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-white/60 shadow-xl flex flex-col gap-4 sm:gap-5 text-slate-800">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900">{title}</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 py-3 sm:py-4 border-y border-slate-200/80 text-slate-700">
            <div className="bg-white/60 p-2.5 sm:p-3 rounded-xl border border-white/80 text-center">
              <span className="text-[10px] sm:text-xs text-slate-500 font-medium block">Bedrooms</span>
              <span className="text-sm sm:text-base font-bold text-slate-800">🛏️ {features?.bedrooms || 0}</span>
            </div>
            <div className="bg-white/60 p-2.5 sm:p-3 rounded-xl border border-white/80 text-center">
              <span className="text-[10px] sm:text-xs text-slate-500 font-medium block">Bathrooms</span>
              <span className="text-sm sm:text-base font-bold text-slate-800">🚿 {features?.bathrooms || 0}</span>
            </div>
            <div className="bg-white/60 p-2.5 sm:p-3 rounded-xl border border-white/80 text-center">
              <span className="text-[10px] sm:text-xs text-slate-500 font-medium block">Area Size</span>
              <span className="text-sm sm:text-base font-bold text-slate-800">
                📐 {features?.area || 0} {features?.areaUnits || "Marla"}
              </span>
            </div>
            <div className="bg-white/60 p-2.5 sm:p-3 rounded-xl border border-white/80 text-center">
              <span className="text-[10px] sm:text-xs text-slate-500 font-medium block">Floors</span>
              <span className="text-sm sm:text-base font-bold text-slate-800">🏢 {features?.floors || 1}</span>
            </div>
          </div>

          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-1.5">Description</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {description || "No description provided for this listing."}
            </p>
          </div>
        </div>

      </div>

      {/* Full-Screen Image Lightbox Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="absolute top-3 right-3 text-white text-xl sm:text-2xl font-bold bg-white/10 hover:bg-white/20 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all cursor-pointer"
          >
            ✕
          </button>

          <div className="relative max-w-5xl max-h-[85vh] w-full flex justify-center items-center">
            <img
              src={activeImageUrl}
              alt="Fullscreen View"
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
            />

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white text-base sm:text-xl w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer"
                >
                  ❮
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white text-base sm:text-xl w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer"
                >
                  ❯
                </button>
              </>
            )}
          </div>

          <div className="absolute bottom-4 bg-slate-800/80 text-white text-[11px] sm:text-xs px-3 py-1.5 rounded-full border border-white/20">
            Image {activeImg + 1} of {images.length}
          </div>
        </div>
      )}
    </div>
  );
}

export default ListingDetails;