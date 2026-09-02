import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProfileNavigationCard from "./ProfileNavigationCard";
import API from "../../api/axios";
import { setUser } from "../../redux/authSlice";

function UpdateProfile() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [statusText, setStatusText] = useState("");
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phoneNumber || "");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar?.url || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
      setPhone(user.phoneNumber || "");
      setAvatarPreview(user.avatar?.url || "");
    }
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusText("");

    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("phoneNumber", phone);

      if (avatar) {
        formData.append("avatar", avatar);
      }

      const response = await API.put("/me/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data?.user) {
        dispatch(setUser(response.data.user));
        setStatusText("Profile updated successfully!");
        setTimeout(() => navigate("/me"), 1200);
      } else {
        setStatusText("Update failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setStatusText(
        err.response?.data?.message || "Unable to update profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-400 via-teal-50 to-emerald-200 p-3 sm:p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
        
        <div className="md:col-span-1">
          <ProfileNavigationCard />
        </div>

        <div className="md:col-span-3 flex justify-center items-start w-full">
          <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl flex flex-col gap-6 shadow-2xl p-4 sm:p-8 md:p-10 w-full max-w-3xl">
            
            <div className="border-b border-slate-200/80 pb-3">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800">
                Update Profile
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Manage your personal information and profile picture.
              </p>
            </div>

            {statusText && (
              <div>
                {statusText.includes("successfully") ? (
                  <p className="text-xs sm:text-sm text-emerald-700 font-semibold px-3.5 py-2.5 bg-emerald-50 rounded-xl border border-emerald-200 shadow-sm">
                    {statusText}
                  </p>
                ) : (
                  <p className="text-xs sm:text-sm text-red-600 font-semibold px-3.5 py-2.5 bg-red-50 rounded-xl border border-red-200 shadow-sm">
                    {statusText}
                  </p>
                )}
              </div>
            )}

            <form className="flex flex-col gap-5 sm:gap-6" onSubmit={handleUpdateProfile}>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-white/60 p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xl sm:text-2xl overflow-hidden shadow-lg shrink-0 border-2 border-emerald-500">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase()
                  )}
                </div>

                <div className="flex flex-col gap-1.5 w-full text-center sm:text-left">
                  <label className="text-xs sm:text-sm text-slate-700 font-semibold">
                    Profile Avatar <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="w-full text-xs sm:text-sm text-slate-600 file:mr-3 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-100 file:text-emerald-800 hover:file:bg-emerald-200 cursor-pointer"
                  />
                  <span className="text-[10px] sm:text-[11px] text-slate-400">
                    JPG, PNG or WEBP up to 5MB
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs sm:text-sm font-semibold text-slate-700">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                    required
                    className="w-full px-3.5 sm:px-4 py-2.5 bg-white/90 backdrop-blur-sm border border-slate-300/80 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-800 placeholder-slate-400 transition-all shadow-sm"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs sm:text-sm font-semibold text-slate-700">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                    className="w-full px-3.5 sm:px-4 py-2.5 bg-white/90 backdrop-blur-sm border border-slate-300/80 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-800 placeholder-slate-400 transition-all shadow-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs sm:text-sm font-semibold text-slate-700">
                    Email Address <span className="text-slate-400 font-normal">(Read-only)</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full px-3.5 sm:px-4 py-2.5 bg-slate-100/80 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed shadow-inner"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs sm:text-sm font-semibold text-slate-700">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="03XX XXXXXXX"
                    required
                    className="w-full px-3.5 sm:px-4 py-2.5 bg-white/90 backdrop-blur-sm border border-slate-300/80 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-800 placeholder-slate-400 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-3 sm:pt-4 border-t border-slate-200/80">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto font-semibold px-6 py-2.5 sm:py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-md text-sm active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

export default UpdateProfile;