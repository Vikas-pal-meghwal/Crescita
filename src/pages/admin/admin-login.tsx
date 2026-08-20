import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";

const ADMIN_EMAIL = import.meta.env.VITE_Admin_Email as string;
const ADMIN_PASSWORD = import.meta.env.VITE_Admin_Password as string;

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (
        email.trim().toLowerCase() === ADMIN_EMAIL?.trim().toLowerCase() &&
        password === ADMIN_PASSWORD?.trim()
      ) {
        sessionStorage.setItem("crescita_admin", "true");
        navigate("/admin/dashboard", { replace: true });
      } else {
        setError("Invalid email or password.");
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <h1
            className="text-[2rem] font-normal text-gray-900 tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Crescita
          </h1>
          <p className="text-[11px] tracking-[0.2em] uppercase text-gray-400 mt-1">
            Admin Portal
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-100 rounded-sm shadow-sm px-8 py-10">
          <h2 className="text-[15px] font-medium text-gray-800 mb-6">Sign in to continue</h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-[11px] tracking-[0.1em] uppercase text-gray-400 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="admin@crescita.in"
                  className="w-full pl-9 pr-4 py-2.5 text-[13px] border border-gray-200 rounded-sm outline-none focus:border-gray-500 transition-colors placeholder:text-gray-300"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] tracking-[0.1em] uppercase text-gray-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 text-[13px] border border-gray-200 rounded-sm outline-none focus:border-gray-500 transition-colors placeholder:text-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors"
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-[12px] text-red-500 bg-red-50 px-3 py-2 rounded-sm border border-red-100">
                <AlertCircle size={13} className="shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gray-900 text-white text-[11px] tracking-[0.15em] uppercase hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-gray-300 mt-6">
          © {new Date().getFullYear()} Crescita · Admin access only
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
