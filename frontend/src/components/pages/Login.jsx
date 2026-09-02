import nioBg from "../../assets/loginBg.jpg"; 
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/authSlice";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginText, setLoginText] = useState("Please enter your credentials");
  const [loading, setLoading] = useState(false);

  const loginUser = async function (e) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await API.post("/login", { email, password });

      if (response.data?.user) {
        dispatch(setUser(response.data.user));
        setLoginText(`Welcome ${response.data.user.firstName}`);
        setTimeout(() => navigate("/"), 1000);
      } else {
        setLoginText("Invalid credentials");
        setPassword("");
      }
    } catch (err) {
      console.log(err);
      setLoginText(err.response?.data?.message || "Invalid credentials");
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

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
            Login User
          </h1>
        </div>

        <div>
          {loginText.startsWith("Welcome") ? (
            <p className="text-sm text-emerald-600 font-semibold">{loginText}</p>
          ) : loginText.startsWith("Please") ? (
            <p className="text-sm text-slate-600 font-medium">{loginText}</p>
          ) : (
            <p className="text-sm text-red-500 font-semibold">{loginText}</p>
          )}
        </div>

        <div>
          <form onSubmit={loginUser} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-300/80 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-800 placeholder-slate-400"
            />

            {/* Password Field Container with Toggle */}
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 pr-11 bg-white/80 backdrop-blur-sm border border-slate-300/80 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-800 placeholder-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 text-sm focus:outline-none cursor-pointer select-none"
                aria-label="Toggle password visibility"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <Link
              to="/password/forgot"
              className="text-emerald-700 hover:text-emerald-800 font-semibold text-sm text-center mt-1"
            >
              Forgot password? Don't worry reset it from here
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 text-white font-semibold px-4 py-3 rounded-xl hover:bg-emerald-700 disabled:opacity-50 active:scale-95 transition-all mt-2 shadow-md cursor-pointer"
            >
              {loading ? "Logging in..." : "Login"}
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

export default Login;