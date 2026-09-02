import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterListingBG from "../../assets/listingRegisterBg.jpg";
import API from "../../api/axios";

function NewListing() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [purpose, setPurpose] = useState("Sale");
  const [propertyType, setPropertyType] = useState("House");
  const [price, setPrice] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [bedrooms, setBedrooms] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [floors, setFloors] = useState(0);
  const [area, setArea] = useState("");
  const [areaUnits, setAreaUnits] = useState("Marla");
  const [images, setImages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 10) {
      setErrorText("You can only upload a maximum of 10 photos.");
      e.target.value = "";
      setImages([]);
      return;
    }

    setErrorText("");
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorText("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("purpose", purpose);
      formData.append("propertyType", propertyType);
      formData.append("price", price);

      formData.append("location[city]", city);
      formData.append("location[address]", address);

      formData.append("features[bedrooms]", bedrooms);
      formData.append("features[bathrooms]", bathrooms);
      formData.append("features[floors]", floors);
      formData.append("features[area]", area);
      formData.append("features[areaUnits]", areaUnits);

      images.forEach((image) => {
        formData.append("images", image);
      });

      const response = await API.post("/listing/new", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data?.success) {
        navigate(`/listing/${response.data.listing._id}`);
      }
    } catch (err) {
      console.log(err);
      setErrorText(
        err.response?.data?.message || "Failed to post listing. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen text-black w-full flex items-center justify-center px-4 py-10 bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1)), url(${RegisterListingBG})`,
      }}
    >
      <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl flex gap-4 flex-col shadow-2xl p-6 sm:p-8 w-full max-w-2xl my-auto">
        <div>
          <h1 className="text-2xl text-slate-800 font-bold border-b-2 border-emerald-600 pb-1">
            List Your Property
          </h1>
        </div>

        {errorText ? (
          <p className="text-xs text-red-500 font-semibold">{errorText}</p>
        ) : (
          <p className="text-xs text-slate-600 font-medium">
            Please fill out the details for your listing (<span className="text-red-500">*</span>)
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-700">Title *</label>
            <input
              type="text"
              placeholder="e.g. Modern 1 Kanal Villa in DHA Phase 5"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={100}
              className="w-full px-3 py-2 mt-1 bg-white/80 backdrop-blur-sm border border-slate-300/80 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-800 placeholder-slate-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">Purpose *</label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full px-3 py-2 mt-1 bg-white/80 backdrop-blur-sm border border-slate-300/80 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-800"
              >
                <option value="Sale">For Sale</option>
                <option value="Rent">For Rent</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Property Type *</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-3 py-2 mt-1 bg-white/80 backdrop-blur-sm border border-slate-300/80 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-800"
              >
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">Price (PKR) *</label>
              <input
                type="number"
                min="0"
                placeholder="e.g. 25000000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full px-3 py-2 mt-1 bg-white/80 backdrop-blur-sm border border-slate-300/80 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-800 placeholder-slate-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Area Size *</label>
              <input
                type="number"
                min="0"
                placeholder="e.g. 10"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                required
                className="w-full px-3 py-2 mt-1 bg-white/80 backdrop-blur-sm border border-slate-300/80 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-800 placeholder-slate-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Area Unit *</label>
              <select
                value={areaUnits}
                onChange={(e) => setAreaUnits(e.target.value)}
                className="w-full px-3 py-2 mt-1 bg-white/80 backdrop-blur-sm border border-slate-300/80 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-800"
              >
                <option value="Marla">Marla</option>
                <option value="Kanal">Kanal</option>
                <option value="Sq. Ft.">Sq. Ft.</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">City *</label>
              <input
                type="text"
                placeholder="e.g. Lahore"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="w-full px-3 py-2 mt-1 bg-white/80 backdrop-blur-sm border border-slate-300/80 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-800 placeholder-slate-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Address *</label>
              <input
                type="text"
                placeholder="e.g. Sector CCA, Phase 5"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full px-3 py-2 mt-1 bg-white/80 backdrop-blur-sm border border-slate-300/80 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-800 placeholder-slate-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">Bedrooms</label>
              <input
                type="number"
                min="0"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full px-3 py-2 mt-1 bg-white/80 backdrop-blur-sm border border-slate-300/80 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-800"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Bathrooms</label>
              <input
                type="number"
                min="0"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
                className="w-full px-3 py-2 mt-1 bg-white/80 backdrop-blur-sm border border-slate-300/80 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-800"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Floors</label>
              <input
                type="number"
                min="0"
                value={floors}
                onChange={(e) => setFloors(e.target.value)}
                className="w-full px-3 py-2 mt-1 bg-white/80 backdrop-blur-sm border border-slate-300/80 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700">Description *</label>
            <textarea
              rows="3"
              placeholder="Describe key highlights, neighborhood features, or nearby amenities..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              maxLength={2000}
              className="w-full px-3 py-2 mt-1 bg-white/80 backdrop-blur-sm border border-slate-300/80 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-800 placeholder-slate-400 resize-none"
            ></textarea>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700">
              Property Photos * <span className="text-slate-500 font-normal">(Max 10)</span>
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              required
              className="w-full px-2 py-1.5 mt-1 bg-white/80 backdrop-blur-sm border border-slate-300/80 rounded-xl text-xs text-slate-600 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-100 file:text-emerald-800 hover:file:bg-emerald-200 cursor-pointer"
            />
            {images.length > 0 && (
              <p className="text-xs text-emerald-700 font-medium mt-1">
                {images.length} photo(s) selected
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-600 text-white font-semibold px-4 py-3 rounded-xl hover:bg-emerald-700 disabled:opacity-50 active:scale-95 transition-all mt-2 shadow-md cursor-pointer text-sm"
          >
            {loading ? "Publishing Listing..." : "Submit Property"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewListing;