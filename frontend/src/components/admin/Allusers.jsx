import React, { useState, useEffect } from "react";
import ProfileNavigationCard from "../user/ProfileNavigationCard";
import API from "../../api/axios";
import { optimizeImage } from "../../utils/imageHelper";

function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for View Details Modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  // State for Delete Confirmation Modal
  const [userToDelete, setUserToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // State for Change Role Modal
  const [userToUpdateRole, setUserToUpdateRole] = useState(null);
  const [selectedRole, setSelectedRole] = useState("user");
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [updatingRole, setUpdatingRole] = useState(false);

  // Fetch all users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/users");
      const data = res.data?.users || res.data?.allUsers || res.data;
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Open View Modal
  const handleOpenView = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  // Delete User Logic
  const handleConfirmDelete = async () => {
    if (!userToDelete?._id) return;
    setDeleting(true);
    try {
      await API.delete(`/admin/user/${userToDelete._id}`);
      setUsers((prev) => (Array.isArray(prev) ? prev.filter((u) => u._id !== userToDelete._id) : []));
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert(err.response?.data?.message || "Failed to delete user.");
    } finally {
      setDeleting(false);
    }
  };

  // Change Role Logic (Fixed PUT request payload)
  const handleConfirmRoleChange = async () => {
    if (!userToUpdateRole?._id) return;
    setUpdatingRole(true);
    try {
      await API.put(`/admin/user/${userToUpdateRole._id}`, { role: selectedRole });
      
      // Update local state instantly
      setUsers((prev) =>
        Array.isArray(prev)
          ? prev.map((u) => (u._id === userToUpdateRole._id ? { ...u, role: selectedRole } : u))
          : []
      );
      setShowRoleModal(false);
      setUserToUpdateRole(null);
    } catch (err) {
      console.error("Failed to update user role:", err);
      alert(err.response?.data?.message || "Failed to update user role.");
    } finally {
      setUpdatingRole(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-400 via-teal-50 to-emerald-200 p-3 sm:p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto">
        
        {/* Navigation Sidebar */}
        <div className="md:col-span-1">
          <ProfileNavigationCard />
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-3 flex flex-col gap-4 sm:gap-6">
          
          {/* Header Banner */}
          <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-4 sm:p-6 shadow-xl flex justify-between items-center flex-wrap gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800">
                User Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Manage registered accounts, view profiles, and update roles.
              </p>
            </div>
            <span className="text-[11px] sm:text-xs font-semibold px-3 py-1.5 bg-amber-100 text-amber-800 border border-amber-300 rounded-full">
              {Array.isArray(users) ? users.length : 0} Total Users
            </span>
          </div>

          {/* User Cards Grid */}
          {loading ? (
            <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-8 text-center text-emerald-800 font-semibold animate-pulse shadow-xl text-xs sm:text-sm">
              Loading registered users...
            </div>
          ) : Array.isArray(users) && users.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
              {users.map((user) => {
                if (!user) return null;
                const role = user.role || "user";
                const firstName = user.firstName || "User";
                const lastName = user.lastName || "";
                const email = user.email || "No email";
                const phone = user.phoneNumber || user.phone || user.contactNumber || "No phone provided";

                // 2. Optimize user avatar for small grid view (width 150px)
                const avatarUrl = user.avatar?.url ? optimizeImage(user.avatar.url, 150) : null;

                return (
                  <div
                    key={user._id || Math.random()}
                    className="bg-white/75 backdrop-blur-md border border-white/60 text-slate-800 rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm overflow-hidden shadow-md shrink-0 border border-emerald-500">
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt={firstName}
                            loading="lazy"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase()
                        )}
                      </div>
                      <div className="overflow-hidden min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-bold text-slate-800 text-sm sm:text-base truncate">
                            {firstName} {lastName}
                          </h3>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 border ${
                              role === "admin"
                                ? "bg-amber-100 text-amber-800 border-amber-300"
                                : "bg-slate-100 text-slate-600 border-slate-300"
                            }`}
                          >
                            {role}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{email}</p>
                        <p className="text-[11px] text-slate-400 mt-1 truncate">
                          📞 {phone}
                        </p>
                      </div>
                    </div>

                    {/* Custom Action Buttons */}
                    <div className="grid grid-cols-3 gap-1.5 pt-3 border-t border-slate-200/80">
                      <button
                        onClick={() => handleOpenView(user)}
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-semibold py-1.5 px-2 rounded-xl text-[11px] transition-all text-center cursor-pointer active:scale-95"
                      >
                        👁️ View
                      </button>

                      <button
                        onClick={() => {
                          setUserToUpdateRole(user);
                          setSelectedRole(role);
                          setShowRoleModal(true);
                        }}
                        className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-semibold py-1.5 px-2 rounded-xl text-[11px] transition-all text-center cursor-pointer active:scale-95"
                      >
                        👑 Role
                      </button>

                      <button
                        onClick={() => {
                          setUserToDelete(user);
                          setShowDeleteModal(true);
                        }}
                        className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/80 font-semibold py-1.5 px-2 rounded-xl text-[11px] transition-all text-center cursor-pointer active:scale-95"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-8 text-center text-slate-600 shadow-xl">
              No users found.
            </div>
          )}

        </div>

      </div>

      {/* CUSTOM MODAL 1: View User Details */}
      {showViewModal && selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
          onClick={() => setShowViewModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-5 sm:p-6 shadow-2xl max-w-sm w-full border border-slate-200 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b pb-3 border-slate-200">
              <h3 className="text-base sm:text-lg font-bold text-slate-800">User Profile Details</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-lg overflow-hidden shrink-0 shadow-md">
                {selectedUser.avatar?.url ? (
                  <img 
                    src={optimizeImage(selectedUser.avatar.url, 200)} // 3. Optimized modal avatar size
                    alt={selectedUser.firstName || "User"} 
                    loading="lazy"
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  `${selectedUser.firstName?.[0] || ""}${selectedUser.lastName?.[0] || ""}`.toUpperCase()
                )}
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-base">
                  {selectedUser.firstName || "N/A"} {selectedUser.lastName || ""}
                </h4>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase">
                  {selectedUser.role || "user"}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 flex flex-col gap-2 text-xs text-slate-700">
              <p><strong>Email:</strong> {selectedUser.email || "N/A"}</p>
              <p><strong>Phone:</strong> {selectedUser.phoneNumber || selectedUser.phone || selectedUser.contactNumber || "Not provided"}</p>
              <p><strong>User ID:</strong> {selectedUser._id || "N/A"}</p>
              <p><strong>Joined:</strong> {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : "N/A"}</p>
            </div>

            <button
              onClick={() => setShowViewModal(false)}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-xs transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* CUSTOM MODAL 2: Delete Confirmation */}
      {showDeleteModal && userToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-5 sm:p-6 shadow-2xl max-w-xs sm:max-w-sm w-full border border-slate-200 flex flex-col gap-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xl mx-auto">
              🚨
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800">Delete User Account?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete <span className="font-bold text-slate-700">"{userToDelete.firstName || "User"} {userToDelete.lastName || ""}"</span>? This will permanently remove their profile.
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
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl text-xs transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM MODAL 3: Change User Role */}
      {showRoleModal && userToUpdateRole && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
          onClick={() => setShowRoleModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-5 sm:p-6 shadow-2xl max-w-xs sm:max-w-sm w-full border border-slate-200 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <h3 className="text-base sm:text-lg font-bold text-slate-800">Change User Role</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Updating role for <span className="font-semibold text-slate-700">{userToUpdateRole.firstName || "User"} {userToUpdateRole.lastName || ""}</span>
              </p>
            </div>

            <div className="flex flex-col gap-2 my-1">
              <label className="text-xs font-semibold text-slate-700">Select Role:</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-600 cursor-pointer"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowRoleModal(false)}
                disabled={updatingRole}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-xs transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRoleChange}
                disabled={updatingRole}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl text-xs transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {updatingRole ? "Saving..." : "Save Role"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AllUsers;