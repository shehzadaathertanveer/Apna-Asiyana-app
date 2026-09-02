import { useEffect, useState } from "react";
import API from "../../api/axios";
import PropertyCard from "./PropertyCard"; 

function AllListings() {
  const [search, setSearch] = useState("");
  const [purpose, setPurpose] = useState("");
  const [pType, setPType] = useState("");
  const [price, setPrice] = useState("");
  const [bathrooms, setBathroom] = useState("");
  const [bedroom, setBedroom] = useState("");
  const [Area, setArea] = useState("");
  const [areaUnit, setAreaUnit] = useState("");
  const [floor, setFloors] = useState("");

  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [allListings, setAllListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    try {
      setLoading(true);

      const params = {};
      if (search) params.keyword = search;
      if (purpose) params.purpose = purpose;
      if (pType) params.propertyType = pType;
      if (price) params.price = price;
      if (bedroom) params.bedrooms = bedroom;
      if (bathrooms) params.bathrooms = bathrooms;
      if (floor) params.floors = floor;
      if (Area) params.area = Area;
      if (areaUnit) params.areaUnits = areaUnit;

      const response = await API.get("/listings", { params });

      if (response.data?.listings) {
        setAllListings(response.data.listings);
      } else if (Array.isArray(response.data)) {
        setAllListings(response.data);
      }
    } catch (err) {
      console.error("Error fetching properties:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchListings();
  };

  function clearAllFilters() {
    setSearch("");
    setPurpose("");
    setPType("");
    setPrice("");
    setBathroom("");
    setBedroom("");
    setArea("");
    setAreaUnit("");
    setFloors("");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-300 via-teal-50 to-slate-100 p-3 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
        
        {/* Mobile Filter Toggle Header */}
        <div className="md:hidden flex items-center justify-between bg-white/80 backdrop-blur-md border border-white/60 p-4 rounded-2xl shadow-md">
          <div>
            <h2 className="text-base font-bold text-slate-800">Filter Properties</h2>
            <p className="text-xs text-slate-500">Find homes by location, price & type</p>
          </div>
          <button
            type="button"
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-3.5 py-2 rounded-xl active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            {showFiltersMobile ? "Close ✕" : "Filters ⚙️"}
          </button>
        </div>

        <div
          className={`w-full md:w-1/4 bg-white/75 backdrop-blur-md border border-white/60 text-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl h-fit transition-all duration-300 ${
            showFiltersMobile ? "block" : "hidden md:block"
          }`}
        >
          <div className="hidden md:flex items-center justify-between border-b border-slate-200/80 pb-3 mb-4">
            <h2 className="text-lg font-bold text-slate-800">Filter Properties</h2>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200/60">
              Live Search
            </span>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex flex-col gap-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Location or Keyword
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="e.g. Lahore, DHA"
                className="w-full px-3.5 py-2 bg-white/90 backdrop-blur-sm border border-slate-300/80 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-800 placeholder-slate-400 transition-all shadow-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Purpose</label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-2.5 py-2 bg-white/90 backdrop-blur-sm border border-slate-300/80 rounded-xl text-xs focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-800 transition-all shadow-sm cursor-pointer"
                >
                  <option value="">All</option>
                  <option value="Sale">For Sale</option>
                  <option value="Rent">For Rent</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Property Type</label>
                <select
                  value={pType}
                  onChange={(e) => setPType(e.target.value)}
                  className="w-full px-2.5 py-2 bg-white/90 backdrop-blur-sm border border-slate-300/80 rounded-xl text-xs focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-800 transition-all shadow-sm cursor-pointer"
                >
                  <option value="">All Types</option>
                  <option value="House">House</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Plot">Plot</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Upper Portion">Upper Portion</option>
                  <option value="Lower Portion">Lower Portion</option>
                  <option value="Farm House">Farm House</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Max Price</label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 25000000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-2.5 py-2 bg-white/90 backdrop-blur-sm border border-slate-300/80 rounded-xl text-xs focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-800 placeholder-slate-400 transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Area Size</label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 10"
                  value={Area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-2.5 py-2 bg-white/90 backdrop-blur-sm border border-slate-300/80 rounded-xl text-xs focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-800 placeholder-slate-400 transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Area Unit</label>
                <select
                  value={areaUnit}
                  onChange={(e) => setAreaUnit(e.target.value)}
                  className="w-full px-2.5 py-2 bg-white/90 backdrop-blur-sm border border-slate-300/80 rounded-xl text-xs focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-800 transition-all shadow-sm cursor-pointer"
                >
                  <option value="">Any</option>
                  <option value="Marla">Marla</option>
                  <option value="Kanal">Kanal</option>
                  <option value="Sq. Ft.">Sq. Ft.</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Bedrooms</label>
                <input
                  type="number"
                  min="0"
                  placeholder="Min beds"
                  value={bedroom}
                  onChange={(e) => setBedroom(e.target.value)}
                  className="w-full px-2.5 py-2 bg-white/90 backdrop-blur-sm border border-slate-300/80 rounded-xl text-xs focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-800 placeholder-slate-400 transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Bathrooms</label>
                <input
                  type="number"
                  min="0"
                  placeholder="Min baths"
                  value={bathrooms}
                  onChange={(e) => setBathroom(e.target.value)}
                  className="w-full px-2.5 py-2 bg-white/90 backdrop-blur-sm border border-slate-300/80 rounded-xl text-xs focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-800 placeholder-slate-400 transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Floors</label>
                <input
                  type="number"
                  min="0"
                  placeholder="Min floors"
                  value={floor}
                  onChange={(e) => setFloors(e.target.value)}
                  className="w-full px-2.5 py-2 bg-white/90 backdrop-blur-sm border border-slate-300/80 rounded-xl text-xs focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-800 placeholder-slate-400 transition-all shadow-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl transition-all shadow-md text-sm mt-1 cursor-pointer active:scale-95"
            >
              Search Properties
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              clearAllFilters();
              fetchListings();
            }}
            className="w-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 font-semibold py-2.5 rounded-xl transition-all text-xs mt-2 cursor-pointer border border-slate-300/60 active:scale-95"
          >
            Clear All Filters
          </button>
        </div>

        <div className="w-full md:w-3/4">
          {loading ? (
            <div className="flex justify-center items-center py-20 text-emerald-700 font-semibold text-base animate-pulse">
              Fetching properties...
            </div>
          ) : allListings.length === 0 ? (
            <div className="bg-white/75 backdrop-blur-md rounded-2xl p-8 text-center text-slate-600 border border-white/60 shadow-md">
              No properties found matching your criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {allListings.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default AllListings; 