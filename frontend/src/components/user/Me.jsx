import React from "react";
import { useSelector } from "react-redux";
import ProfileNavigationCard from "./ProfileNavigationCard";

function Me() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-400 via-teal-50 to-emerald-200 p-3 sm:p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
        
        {/* Side 1: Navigation Sidebar (1 Column) */}
        <div className="md:col-span-1">
          <ProfileNavigationCard />
        </div>

        {/* Side 2: Main Profile Details Card (3 Columns) */}
        <div className="md:col-span-3 flex justify-center items-start w-full">
          <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl flex flex-col gap-6 shadow-2xl p-6 sm:p-8 md:p-10 w-full max-w-3xl">
            
            {/* Header */}
            <div className="border-b border-slate-200/80 pb-3 flex justify-between items-center flex-wrap gap-2">
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800">
                  User Profile
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Personal account details and information.
                </p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full capitalize">
                {user?.role || "User"}
              </span>
            </div>

            {/* Profile Overview Banner */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-white/60 p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-2xl sm:text-3xl overflow-hidden shadow-lg border-2 border-emerald-500 shrink-0">
                {user?.avatar?.url ? (
                  <img
                    src={user.avatar.url}
                    alt={user.firstName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`.toUpperCase()
                )}
              </div>

              <div className="flex flex-col gap-1 text-center sm:text-left">
                <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">{user?.email}</p>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
                  Member Since: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </div>

            {/* User Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/60 p-4 rounded-xl border border-slate-200/60 flex flex-col gap-1">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  First Name
                </span>
                <span className="text-sm font-semibold text-slate-800">
                  {user?.firstName || "N/A"}
                </span>
              </div>

              <div className="bg-white/60 p-4 rounded-xl border border-slate-200/60 flex flex-col gap-1">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  Last Name
                </span>
                <span className="text-sm font-semibold text-slate-800">
                  {user?.lastName || "N/A"}
                </span>
              </div>

              <div className="bg-white/60 p-4 rounded-xl border border-slate-200/60 flex flex-col gap-1">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  Email Address
                </span>
                <span className="text-sm font-semibold text-slate-800">
                  {user?.email || "N/A"}
                </span>
              </div>

              <div className="bg-white/60 p-4 rounded-xl border border-slate-200/60 flex flex-col gap-1">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  Phone Number
                </span>
                <span className="text-sm font-semibold text-slate-800">
                  {user?.phoneNumber || "N/A"}
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Me;