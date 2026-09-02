import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProfileNavigationCard from "./ProfileNavigationCard";
import API from "../../api/axios";
import { logoutUser } from "../../redux/authSlice";

function MySecurity() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  const [statusText, setStatusText] = useState("");
  const [loading, setLoading] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

 
  const isMinLength = newPassword.length >= 8;
  const hasNumber = /\d/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const isPasswordValid = isMinLength && hasNumber && hasSpecialChar;
  const isMatch = newPassword && newPassword === confirmPassword;

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!isPasswordValid) {
      setStatusText("New password does not meet security requirements.");
      return;
    }

    if (!isMatch) {
      setStatusText("New passwords do not match.");
      return;
    }

    setLoading(true);
    setStatusText("");

    try {

      const response = await API.put("/me/update/password", {
        oldPassword,
        newPassword,
        confirmPassword,
      });

      if (response.data?.success) {
        setStatusText("Password updated successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setStatusText("Failed to update password. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setStatusText(
        err.response?.data?.message || "Current password is incorrect."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await API.delete("/me/delete");
      dispatch(logoutUser());
      navigate("/");
    } catch (err) {
      console.error("Failed to delete account:", err);
      alert(err.response?.data?.message || "Failed to delete account. Please try again.");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-400 via-teal-50 to-emerald-200 p-3 sm:p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto">
        
        <div className="md:col-span-1">
          <ProfileNavigationCard />
        </div>

  
        <div className="md:col-span-3 flex justify-center items-start w-full">
          <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl flex flex-col gap-5 sm:gap-6 shadow-2xl p-4 sm:p-8 md:p-10 w-full max-w-3xl">
            

            <div className="border-b border-slate-200/80 pb-3">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800">
                Security & Account Settings
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Manage your credentials or close your account.
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

            <div className="flex flex-col gap-4">
              <h2 className="text-sm sm:text-base md:text-lg font-bold text-slate-800 flex items-center gap-2">
                🔒 Change Password
              </h2>

              <form className="flex flex-col gap-4 sm:gap-5" onSubmit={handlePasswordChange}>
                
                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-xs sm:text-sm font-semibold text-slate-700">
                    Current Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative w-full">
                    <input
                      type={showOldPass ? "text" : "password"}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Enter current password"
                      required
                      className="w-full px-3.5 sm:px-4 py-2.5 pr-10 bg-white/90 backdrop-blur-sm border border-slate-300/80 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-800 placeholder-slate-400 transition-all shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPass(!showOldPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 text-xs focus:outline-none cursor-pointer select-none"
                    >
                      {showOldPass ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs sm:text-sm font-semibold text-slate-700">
                      New Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative w-full">
                      <input
                        type={showNewPass ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        required
                        className="w-full px-3.5 sm:px-4 py-2.5 pr-10 bg-white/90 backdrop-blur-sm border border-slate-300/80 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-800 placeholder-slate-400 transition-all shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 text-xs focus:outline-none cursor-pointer select-none"
                      >
                        {showNewPass ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs sm:text-sm font-semibold text-slate-700">
                      Confirm New Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      required
                      className="w-full px-3.5 sm:px-4 py-2.5 bg-white/90 backdrop-blur-sm border border-slate-300/80 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-800 placeholder-slate-400 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="bg-white/50 p-3 sm:p-4 rounded-xl border border-slate-200/80 flex flex-wrap items-center gap-x-2.5 sm:gap-x-3 gap-y-1 text-xs">
                  <span className="text-slate-600 font-semibold">Requirements:</span>
                  <span className={isMinLength ? "text-emerald-700 font-bold" : "text-slate-400"}>
                    {isMinLength ? "✓" : "•"} 8+ chars
                  </span>
                  <span className={hasNumber ? "text-emerald-700 font-bold" : "text-slate-400"}>
                    {hasNumber ? "✓" : "•"} 1 number
                  </span>
                  <span className={hasSpecialChar ? "text-emerald-700 font-bold" : "text-slate-400"}>
                    {hasSpecialChar ? "✓" : "•"} 1 special char
                  </span>
                  {confirmPassword && (
                    <span className={isMatch ? "text-emerald-700 font-bold" : "text-red-500 font-bold"}>
                      {isMatch ? "✓ Passwords Match" : "✕ Passwords Do Not Match"}
                    </span>
                  )}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={loading || !isPasswordValid || !isMatch || !oldPassword}
                    className="w-full sm:w-auto font-semibold px-6 py-2.5 sm:py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-md text-sm active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </button>
                </div>

              </form>
            </div>

            <div className="border-t border-slate-200/80 pt-5 mt-1 flex flex-col gap-3">
              <h2 className="text-sm sm:text-base md:text-lg font-bold text-red-600 flex items-center gap-2">
                ⚠️ Danger Zone
              </h2>
              <div className="bg-red-50/80 border border-red-200/80 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3.5">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800">Delete Account</h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                    Permanently delete your profile and all associated property listings.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
                >
                  Delete My Account
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-5 sm:p-6 shadow-2xl max-w-xs sm:max-w-sm w-full border border-slate-200 flex flex-col gap-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-lg sm:text-xl mx-auto">
              🚨
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800">Delete Your Account?</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                This action is <span className="font-bold text-red-600">permanent</span> and cannot be undone. All your listings, favorites, and profile details will be completely removed.
              </p>
            </div>

            <div className="flex gap-2.5 sm:gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-xs transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl text-xs transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Yes, Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MySecurity;