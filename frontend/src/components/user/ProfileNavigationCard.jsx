import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../../redux/authSlice";

function ProfileNavigationCard() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-white/70 backdrop-blur-md border-2 border-emerald-600/40 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col gap-4 sm:gap-5">

      <div className="flex items-center gap-3 pb-3 sm:pb-4 border-b border-slate-200/80">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-base sm:text-lg overflow-hidden shadow-md shrink-0 border border-emerald-500">
          {user?.avatar?.url ? (
            <img
              src={user.avatar.url}
              alt={user?.firstName || "User"}
              className="w-full h-full object-cover"
            />
          ) : (
            `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`.toUpperCase()
          )}
        </div>
        <div className="overflow-hidden min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h2 className="font-bold text-slate-800 text-sm sm:text-base truncate">
              {user?.firstName} {user?.lastName}
            </h2>
            {user?.role === "admin" && (
              <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                Admin
              </span>
            )}
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 truncate">{user?.email}</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1 sm:gap-1.5 text-xs sm:text-sm font-medium">
        <Link
          to="/me"
          className={`px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl transition-all flex items-center gap-2.5 ${
            isActive("/me")
              ? "bg-emerald-600 text-white shadow-md font-semibold"
              : "text-slate-700 hover:bg-emerald-50/80 hover:text-emerald-700"
          }`}
        >
          <span>👤</span> <span>My Profile</span>
        </Link>

        <Link
          to="/me/listings"
          className={`px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl transition-all flex items-center gap-2.5 ${
            isActive("/me/listings")
              ? "bg-emerald-600 text-white shadow-md font-semibold"
              : "text-slate-700 hover:bg-emerald-50/80 hover:text-emerald-700"
          }`}
        >
          <span>🏠</span> <span>My Properties</span>
        </Link>

        <Link
          to="/me/favorites"
          className={`px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl transition-all flex items-center gap-2.5 ${
            isActive("/me/favorites")
              ? "bg-emerald-600 text-white shadow-md font-semibold"
              : "text-slate-700 hover:bg-emerald-50/80 hover:text-emerald-700"
          }`}
        >
          <span>❤️</span> <span>My Favorites</span>
        </Link>

        <Link
          to="/me/update"
          className={`px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl transition-all flex items-center gap-2.5 ${
            isActive("/me/update")
              ? "bg-emerald-600 text-white shadow-md font-semibold"
              : "text-slate-700 hover:bg-emerald-50/80 hover:text-emerald-700"
          }`}
        >
          <span>✏️</span> <span>Update Profile</span>
        </Link>

        <Link
          to="/me/security"
          className={`px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl transition-all flex items-center gap-2.5 ${
            isActive("/me/security")
              ? "bg-emerald-600 text-white shadow-md font-semibold"
              : "text-slate-700 hover:bg-emerald-50/80 hover:text-emerald-700"
          }`}
        >
          <span>🔒</span> <span>Security</span>
        </Link>

        {user?.role === "admin" && (
          <div className="pt-3 mt-1 border-t border-slate-200/80 flex flex-col gap-1 sm:gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3.5 mb-0.5">
              Admin Panel
            </span>

            <Link
              to="/admin/users"
              className={`px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl transition-all flex items-center gap-2.5 ${
                isActive("/admin/users")
                  ? "bg-amber-600 text-white shadow-md font-semibold"
                  : "text-slate-700 hover:bg-amber-50 hover:text-amber-800"
              }`}
            >
              <span>👥</span> <span>View All Users</span>
            </Link>

            <Link
              to="/admin/messages"
              className={`px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl transition-all flex items-center gap-2.5 ${
                isActive("/admin/messages")
                  ? "bg-amber-600 text-white shadow-md font-semibold"
                  : "text-slate-700 hover:bg-amber-50 hover:text-amber-800"
              }`}
            >
              <span>💬</span> <span>View Messages</span>
            </Link>
          </div>
        )}
      </nav>

      <div className="pt-2 border-t border-slate-200/80">
        <button
          onClick={handleLogout}
          className="w-full text-left px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-red-600 font-semibold hover:bg-red-50 text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}

export default ProfileNavigationCard;