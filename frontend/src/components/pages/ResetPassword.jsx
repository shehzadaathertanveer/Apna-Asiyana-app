import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import nioBg from "../../assets/loginBg.jpg";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [startingText, setStartingText] = useState(
    "Please Enter your new Password"
  );
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Toggle state for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const isPasswordValid = isMinLength && hasNumber && hasSpecialChar;

  const getRuleColor = (isValid) =>
    isValid ? "text-emerald-600 font-semibold" : "text-slate-400 font-medium";

  async function handleResetPassword(e) {
    e.preventDefault();

    if (!isPasswordValid) {
      setStartingText("Password does not meet the security requirements");
      return;
    }

    if (password !== confirmPassword) {
      setStartingText("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await API.put(`/password/reset/${token}`, {
        password,
        confirmPassword,
      });

      if (response.status === 200 || response.data?.success) {
        setStartingText("Password reset successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (err) {
      setStartingText(
        err.response?.data?.message || "Token is invalid or has expired"
      );
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
            Reset Password
          </h1>
        </div>

        <div>
          {startingText.startsWith("Password reset") ? (
            <p className="text-sm text-emerald-600 font-semibold">
              {startingText}
            </p>
          ) : startingText.startsWith("Please") ? (
            <p className="text-sm text-slate-600 font-medium">{startingText}</p>
          ) : (
            <p className="text-sm text-red-500 font-semibold">{startingText}</p>
          )}
        </div>

        <div>
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
            {/* New Password Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                New Password
              </label>

              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New Password *"
                  required
                  className="w-full px-4 py-3 pr-11 bg-white/80 backdrop-blur-sm border border-slate-300/80 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-800 placeholder-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 text-sm focus:outline-none cursor-pointer select-none"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>

              {/* Password Requirements */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs px-1 pt-1">
                <span className="text-slate-600 font-medium">
                  Requirements:
                </span>
                <span className={getRuleColor(isMinLength)}>8+ chars</span>
                <span className="text-slate-400">•</span>
                <span className={getRuleColor(hasNumber)}>1 number</span>
                <span className="text-slate-400">•</span>
                <span className={getRuleColor(hasSpecialChar)}>
                  1 special char
                </span>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Confirm Password
              </label>

              <div className="relative w-full">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm New Password *"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-11 bg-white/80 backdrop-blur-sm border border-slate-300/80 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-800 placeholder-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 text-sm focus:outline-none cursor-pointer select-none"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <Link
              to="/password/forgot"
              className="text-emerald-700 hover:text-emerald-800 font-semibold text-sm text-center mt-1"
            >
              Token Expired? Back to Forgot Password Page
            </Link>

            <button
              type="submit"
              disabled={loading || !isPasswordValid}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-3 rounded-xl disabled:opacity-50 active:scale-95 transition-all mt-2 shadow-md cursor-pointer"
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>

            <Link
              to="/login"
              className="text-emerald-700 hover:text-emerald-800 font-semibold text-sm text-center mt-1"
            >
              Back to Login
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;