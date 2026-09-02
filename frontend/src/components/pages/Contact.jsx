import { useState } from "react";
import contactBg from "../../assets/contactBG.jpg";
import API from "../../api/axios";

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("General Inquiry");
  const [message, setMessage] = useState("");
  const [statusText, setStatusText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusText("");

    try {
      const response = await API.post("/contact", {
        name,
        email,
        phone,
        subject,
        message,
      });

      if (response.data?.success) {
        setStatusText(response.data?.message || "Thank you! Your message has been sent successfully.");
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
      }
    } catch (err) {
      console.log(err);
      setStatusText(
        err.response?.data?.message || "Failed to send message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 py-8 bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2)), url(${contactBg})`,
      }}
    >
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-4xl my-auto flex flex-col md:flex-row gap-8">
        
        {/* Left Side: Contact Information */}
        <div className="md:w-5/12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200 pb-6 md:pb-0 md:pr-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 border-b-2 border-emerald-600 pb-2">
              Contact Us
            </h1>
            <p className="text-sm text-slate-600 mt-3">
              Have questions about properties or need assistance? Reach out to our team anytime!
            </p>

            <div className="flex flex-col gap-4 mt-6">
              <div className="flex items-center gap-3">
                <span className="text-xl">📍</span>
                <div>
                  <p className="text-xs text-slate-400 font-semibold">Address</p>
                  <p className="text-sm font-medium text-slate-700">DHA Phase 5, Lahore, Pakistan</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xl">📞</span>
                <div>
                  <p className="text-xs text-slate-400 font-semibold">Phone</p>
                  <p className="text-sm font-medium text-slate-700">+92 300 1234567</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xl">✉️</span>
                <div>
                  <p className="text-xs text-slate-400 font-semibold">Email</p>
                  <p className="text-sm font-medium text-slate-700">support@apnaashiyana.com</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xl">⏰</span>
                <div>
                  <p className="text-xs text-slate-400 font-semibold">Working Hours</p>
                  <p className="text-sm font-medium text-slate-700">Mon - Sat: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-400 font-medium">Connect with us on social media</p>
            <div className="flex gap-3 text-emerald-600 font-medium text-sm mt-1">
              <a href="#" className="hover:underline">Facebook</a>
              <span>•</span>
              <a href="#" className="hover:underline">Instagram</a>
              <span>•</span>
              <a href="#" className="hover:underline">WhatsApp</a>
            </div>
          </div>
        </div>

        {/* Right Side: Message Form */}
        <div className="md:w-7/12 flex flex-col justify-center">
          <h2 className="text-xl font-bold text-slate-800 mb-1">Send a Message</h2>
          
          {statusText && (
            <p className={`text-xs font-medium mb-2 ${statusText.toLowerCase().includes("thank") || statusText.toLowerCase().includes("success") ? "text-emerald-600" : "text-red-500"}`}>
              {statusText}
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Full Name *"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-800 placeholder-slate-400"
            />

            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address *"
                required
                className="w-1/2 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-800 placeholder-slate-400"
              />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number *"
                required
                className="w-1/2 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-800 placeholder-slate-400"
              />
            </div>

            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-700 bg-white"
            >
              <option value="General Inquiry">General Inquiry</option>
              <option value="Buying Property">Buying Property</option>
              <option value="Selling Property">Selling Property</option>
              <option value="Technical Support">Technical Support</option>
            </select>

            <textarea
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="How can we help you? *"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-800 placeholder-slate-400 resize-none"
            ></textarea>

            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold px-4 py-2.5 rounded-lg active:scale-95 transition-all shadow-md text-sm mt-1 cursor-pointer"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Contact;