import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import registerBg from "../../assets/loginBg.jpg"; 
import API from "../../api/axios";
import { setUser } from "../../redux/authSlice";

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [registerText, setRegistertext] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  const isMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const isPasswordValid = isMinLength && hasNumber && hasSpecialChar;

  const getRuleColor = (isValid) => {
    if (password.length === 0) return "text-slate-400";
    return isValid
      ? "text-emerald-700 font-semibold"
      : "text-red-500 font-medium";
  };

  const registerNewUser = async function (e) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("phoneNumber", phone);
      formData.append("password", password);

      if (avatar) {
        formData.append("avatar", avatar);
      }

      const response = await API.post("/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data?.user) {
        dispatch(setUser(response.data.user));
        setRegistertext(`Welcome ${response.data.user.firstName}`);
        setTimeout(() => navigate("/"), 1000);
      } else {
        setRegistertext("Registration failed. Please try again.");
      }
    } catch (err) {
      console.log(err);
      setRegistertext(
        err.response?.data?.message || "Unable to register user, Please try again"
      );
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen text-black w-full flex items-center justify-center px-4 py-6 bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1)), url(${registerBg})`,
      }}
    >
      <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl flex gap-3 flex-col shadow-2xl p-6 sm:p-7 w-full max-w-md my-auto">
        <div>
          <h1 className="text-2xl text-slate-800 font-bold border-b-2 border-emerald-600 pb-1">
            Register A New User
          </h1>
        </div>

        <div>
          {registerText.startsWith("Welcome") ? (
            <p className="text-xs text-emerald-600 font-semibold">{registerText}</p>
          ) : registerText ? (
            <p className="text-xs text-red-500 font-semibold">{registerText}</p>
          ) : (
            <p className="text-xs text-slate-600 font-medium">
              Please fill out the required fields (<span className="text-red-500">*</span>)
            </p>
          )}
        </div>

        <form className="flex flex-col gap-2.5" onSubmit={registerNewUser}>
          <div className="flex gap-2">
            <div className="w-1/2">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name *"
                required
                className="w-full px-3 py-2 bg-white/80 backdrop-blur-sm border border-slate-300/80 rounded-lg text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-800 placeholder-slate-400"
              />
            </div>
            <div className="w-1/2">
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                className="w-full px-3 py-2 bg-white/80 backdrop-blur-sm border border-slate-300/80 rounded-lg text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-800 placeholder-slate-400"
              />
            </div>
          </div>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address *"
            required
            className="w-full px-3 py-2 bg-white/80 backdrop-blur-sm border border-slate-300/80 rounded-lg text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-800 placeholder-slate-400"
          />

          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone Number (03XX XXXXXXX) *"
            required
            className="w-full px-3 py-2 bg-white/80 backdrop-blur-sm border border-slate-300/80 rounded-lg text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-800 placeholder-slate-400"
          />

          <div className="flex flex-col gap-0.5">
            <label className="text-xs text-slate-700 font-medium ml-1">
              Profile Avatar <span className="text-slate-500">(Optional)</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files[0])}
              className="w-full px-2 py-1 bg-white/80 backdrop-blur-sm border border-slate-300/80 rounded-lg text-xs text-slate-600 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-100 file:text-emerald-800 hover:file:bg-emerald-200 cursor-pointer"
            />
          </div>

          {/* Password Field Container with Toggle Button */}
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password *"
              required
              className="w-full px-3 py-2 pr-10 bg-white/80 backdrop-blur-sm border border-slate-300/80 rounded-lg text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-800 placeholder-slate-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 text-xs focus:outline-none cursor-pointer select-none"
              aria-label="Toggle password visibility"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs px-1">
            <span className="text-slate-600 font-medium">Requirements:</span>
            <span className={getRuleColor(isMinLength)}>8+ chars</span>
            <span className="text-slate-400">•</span>
            <span className={getRuleColor(hasNumber)}>1 number</span>
            <span className="text-slate-400">•</span>
            <span className={getRuleColor(hasSpecialChar)}>1 special char</span>
          </div>

          <button
            type="submit"
            disabled={!isPasswordValid || loading}
            className={`font-semibold px-4 py-2.5 rounded-lg transition-all mt-1 shadow-md text-sm ${
              isPasswordValid && !loading
                ? "bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95 cursor-pointer"
                : "bg-slate-300/80 text-slate-500 cursor-not-allowed shadow-none"
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <Link
            to="/login"
            className="text-emerald-700 hover:text-emerald-800 font-semibold text-xs text-center mt-1"
          >
            Already have an account? Login now
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Register;