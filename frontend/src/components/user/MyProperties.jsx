import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ProfileNavigationCard from "./ProfileNavigationCard";
import MyPropertyCard from "./MyPropertyCard";
import API from "../../api/axios";

function MyProperties() {
  const { user } = useSelector((state) => state.auth);
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        const response = await API.get("/me/listings");
        setMyListings(response.data.listings || response.data || []);
      } catch (err) {
        console.error("Failed to fetch my properties:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyListings();
  }, []);

  const handleDeleteProperty = (deletedId) => {
    setMyListings((prev) => prev.filter((item) => item._id !== deletedId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-400 via-teal-50 to-emerald-200 p-3 sm:p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
        
        {/* Navigation Sidebar */}
        <div className="md:col-span-1">
          <ProfileNavigationCard />
        </div>

        {/* Main Properties Area */}
        <div className="md:col-span-3 flex flex-col gap-6">
          
          {/* Header */}
          <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-xl flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
                My Properties
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Manage and view all your posted property listings.
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full">
              {myListings.length} {myListings.length === 1 ? "Property" : "Properties"} Listed
            </span>
          </div>

          {loading ? (
            <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-12 text-center text-emerald-800 font-semibold animate-pulse shadow-xl">
              Loading your properties...
            </div>
          ) : myListings.length === 0 ? (
            <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-12 text-center text-slate-600 shadow-xl flex flex-col items-center gap-3">
              <span className="text-4xl">🏠</span>
              <p className="text-base font-semibold text-slate-700">No properties posted yet.</p>
              <p className="text-xs text-slate-500">When you list a property, it will show up here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {myListings.map((property) => (
                <MyPropertyCard
                  key={property._id}
                  property={property}
                  onDelete={handleDeleteProperty}
                />
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default MyProperties;