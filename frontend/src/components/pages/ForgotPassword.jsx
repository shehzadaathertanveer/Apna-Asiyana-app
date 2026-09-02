import { Link } from "react-router-dom";
import nioBg from "../../assets/loginBg.jpg";
import { useState } from "react";
import API from "../../api/axios";

function ForgotPassword() {
  const [startingText, setStartingText] = useState("Please Enter your Email");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function forgotPassword(e) {
    e.preventDefault(); 
    
    try {
      setLoading(true);

      const response = await API.post("/password/forgot", { email });

      if (response.status === 200 || response.data?.success) {
        setStartingText("Email sent Successfully, Please Check your email for further instructions");
      }
    } catch (err) {
      setStartingText(err.response?.data?.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen text-black w-full flex items-center justify-center px-6 py-12 bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1)), url(${nioBg})`,
      }}
    >
      <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl flex gap-5 flex-col shadow-2xl p-8 w-full max-w-md">
        <div>
          <h1 className="text-3xl text-slate-800 font-bold border-b-2 border-emerald-600 pb-2">
            Forgot Password
          </h1>
        </div>

        <div>
          {startingText.startsWith("Email") ? (
            <p className="text-sm text-emerald-600 font-semibold">{startingText}</p>
          ) : startingText.startsWith("Please") ? (
            <p className="text-sm text-slate-600 font-medium">{startingText}</p>
          ) : (
            <p className="text-sm text-red-500 font-semibold">{startingText}</p>
          )}
        </div>

        <div>
          <form onSubmit={forgotPassword} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-300/80 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-800 placeholder-slate-400"
            />

            <Link
              to="/login"
              className="text-emerald-700 hover:text-emerald-800 font-semibold text-sm text-center mt-1"
            >
              Remember your password? Back to login page
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 text-white font-semibold px-4 py-3 rounded-xl hover:bg-emerald-700 disabled:opacity-50 active:scale-95 transition-all mt-2 shadow-md cursor-pointer"
            >
              {loading ? "Sending mail..." : "Send mail"}
            </button>

            <Link
              to="/register"
              className="text-emerald-700 hover:text-emerald-800 font-semibold text-sm text-center mt-1"
            >
              Don't have an account? Register now
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;