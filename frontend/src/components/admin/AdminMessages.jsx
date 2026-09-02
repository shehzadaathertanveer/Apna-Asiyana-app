import React, { useState, useEffect } from "react";
import ProfileNavigationCard from "../user/ProfileNavigationCard";
import API from "../../api/axios";

function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMsg, setSelectedMsg] = useState(null);

  // Fetch all messages on mount
  useEffect(() => {
    API.get("/admin/messages")
      .then((res) => {
        const data = res.data?.messages || res.data || [];
        setMessages(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Error fetching messages:", err))
      .finally(() => setLoading(false));
  }, []);

  // Handler to mark message as read directly via API
  const handleMarkAsRead = async (msgId, e) => {
    e?.stopPropagation(); // Prevent opening modal if button clicked inside card
    try {
      await API.patch(`/admin/messages/${msgId}/read`);
      setMessages((prev) =>
        prev.map((m) => (m._id === msgId ? { ...m, isRead: true } : m))
      );
    } catch (err) {
      console.error("Failed to mark message as read:", err);
    }
  };

  // Open modal and automatically mark as read if unread
  const handleOpenMessage = (msg) => {
    setSelectedMsg(msg);
    if (!msg.isRead) {
      handleMarkAsRead(msg._id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-400 via-teal-50 to-emerald-200 p-4 sm:p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
        
        {/* Navigation Sidebar */}
        <div className="md:col-span-1">
          <ProfileNavigationCard />
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-3 flex flex-col gap-4">
          <div className="bg-white/80 p-4 rounded-xl shadow-md flex justify-between items-center">
            <h1 className="text-xl font-bold text-slate-800">Inquiries & Messages</h1>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">
              {messages.length} Messages
            </span>
          </div>

          {loading ? (
            <div className="text-center p-8 bg-white/70 rounded-xl font-semibold text-slate-700">
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center p-8 bg-white/70 rounded-xl text-slate-600">
              No messages found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`bg-white p-4 rounded-xl shadow-md flex flex-col justify-between gap-3 border transition-all ${
                    !msg.isRead ? "border-emerald-500 ring-2 ring-emerald-300" : "border-slate-200"
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-bold text-slate-800 text-sm truncate">{msg.name}</h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          !msg.isRead ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {!msg.isRead ? "Unread" : "Read"}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 truncate">📧 {msg.email}</p>
                    <p className="text-xs text-slate-500 truncate">📞 {msg.phone}</p>
                    <p className="text-xs font-semibold text-emerald-800 mt-2 truncate">
                      Subject: {msg.subject || "General Inquiry"}
                    </p>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                      "{msg.message}"
                    </p>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-2 border-t border-slate-100 flex gap-2 justify-end">
                    {/* Explicit Mark Read Button */}
                    {!msg.isRead && (
                      <button
                        onClick={(e) => handleMarkAsRead(msg._id, e)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs px-3 py-1.5 rounded font-semibold transition-all cursor-pointer"
                      >
                        ✓ Mark Read
                      </button>
                    )}

                    {/* View Message Button */}
                    <button
                      onClick={() => handleOpenMessage(msg)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded font-semibold transition-all cursor-pointer"
                    >
                      View Message
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* View Message Modal Popup */}
      {selectedMsg && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedMsg(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-800 text-base">Inquiry Details</h3>
              <button
                onClick={() => setSelectedMsg(null)}
                className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg flex flex-col gap-1">
              <p><strong>From:</strong> {selectedMsg.name}</p>
              <p><strong>Email:</strong> {selectedMsg.email}</p>
              <p><strong>Phone:</strong> {selectedMsg.phone}</p>
              <p><strong>Subject:</strong> {selectedMsg.subject || "General Inquiry"}</p>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-700">Message:</span>
              <p className="text-xs text-slate-800 bg-slate-100 p-3 rounded-lg mt-1 whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
                {selectedMsg.message}
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <a
                href={`mailto:${selectedMsg.email}`}
                className="flex-1 bg-emerald-600 text-white text-center text-xs py-2 rounded-xl font-semibold hover:bg-emerald-700"
              >
                Reply Email
              </a>
              <button
                onClick={() => setSelectedMsg(null)}
                className="flex-1 bg-slate-100 text-slate-700 text-xs py-2 rounded-xl font-semibold hover:bg-slate-200 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminMessages;