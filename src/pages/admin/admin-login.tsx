import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Eye, EyeOff, Lock, Mail, AlertCircle, Loader2 } from "lucide-react";
import logo from "../../assets/crescita-logo.png";

const ADMIN_EMAIL = import.meta.env.VITE_Admin_Email as string;
const ADMIN_PASSWORD = import.meta.env.VITE_Admin_Password as string;

// Form inputs type definition
interface IAdminLoginForm {
  email: string;
  password: string;
}

const AdminLogin = () => {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [authError, setAuthError] = useState("");

  // React Hook Form initialization
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IAdminLoginForm>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched", // Validates on focus blur
  });

  // Submit Handler
  const onSubmit: SubmitHandler<IAdminLoginForm> = async (data) => {
    setAuthError("");

    try {
      // Simulate API network request delay
      await new Promise((resolve) => setTimeout(resolve, 600));

      const isEmailValid = data.email.trim().toLowerCase() === ADMIN_EMAIL?.trim().toLowerCase();
      const isPasswordValid = data.password === ADMIN_PASSWORD?.trim();

      if (isEmailValid && isPasswordValid) {
        sessionStorage.setItem("crescita_admin", "true");
        navigate("/admin/dashboard", { replace: true });
      } else {
        setAuthError("Invalid email or password.");
      }
    } catch {
      setAuthError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between font-sans">
      {/* Header / Navbar */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-8 h-14 flex items-center justify-between">
        <a href="/" className="shrink-0 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-sm" aria-label="Home">
          <img src={logo} alt="Crescita Logo" className="h-8 w-auto object-contain" />
        </a>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white w-full max-w-md border border-gray-100 rounded-md shadow-xl p-6 sm:p-10 transition-all">
          <div className="text-center mb-8">
            <h1
              className="text-3xl font-serif text-gray-900 tracking-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Admin Portal
            </h1>
            <p className="text-xs text-gray-400 mt-2 uppercase tracking-widest">
              Sign in to manage your workspace
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>

            {/* Authentication Error Response */}
            {authError && (
              <div role="alert" className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-3 rounded-md border border-red-100">
                <AlertCircle size={15} className="shrink-0" />
                <span>{authError}</span>
              </div>
            )}
            {/* Email Field */}
            <div>
              <label htmlFor="admin-email" className="block text-[11px] font-medium tracking-wider uppercase text-gray-500 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@crescita.in"
                  aria-invalid={!!errors.email}
                  className={`w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50/50 border rounded-md outline-none focus:bg-white  transition-all placeholder:text-gray-300 ${errors.email
                    ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-200 focus:border-gray-900 focus:ring-gray-900"
                    }`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="admin-password" className="block text-[11px] font-medium tracking-wider uppercase text-gray-500 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  id="admin-password"
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  aria-invalid={!!errors.password}
                  className={`w-full pl-10 pr-10 py-2.5 text-sm bg-gray-50/50 border rounded-md outline-none focus:bg-white  transition-all placeholder:text-gray-300 ${errors.password
                    ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-200 focus:border-gray-900 focus:ring-gray-900"
                    }`}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPass((prev) => !prev)}
                  aria-label={showPass ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>


            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gray-900 text-white text-xs font-medium tracking-widest uppercase rounded-md hover:bg-gray-800 focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Signing in…</span>
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center">
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} Crescita · Admin access only
        </p>
      </footer>
    </div>
  );
};

export default AdminLogin;

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Eye, EyeOff, Lock, Mail, AlertCircle, Loader2 } from "lucide-react";
// import logo from "../../assets/crescita-logo.png";

// const ADMIN_EMAIL = import.meta.env.VITE_Admin_Email as string;
// const ADMIN_PASSWORD = import.meta.env.VITE_Admin_Password as string;

// const AdminLogin = () => {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPass, setShowPass] = useState(false);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       // Simulate API network request delay
//       await new Promise((resolve) => setTimeout(resolve, 600));

//       const isEmailValid = email.trim().toLowerCase() === ADMIN_EMAIL?.trim().toLowerCase();
//       const isPasswordValid = password === ADMIN_PASSWORD?.trim();

//       if (isEmailValid && isPasswordValid) {
//         sessionStorage.setItem("crescita_admin", "true");
//         navigate("/admin/dashboard", { replace: true });
//       } else {
//         setError("Invalid email or password.");
//       }
//     } catch {
//       setError("An unexpected error occurred. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col justify-between font-sans">
//       {/* Navbar */}
//       <header className="bg-white border-b border-gray-200 px-4 sm:px-8 h-14 flex items-center justify-between">
//         <a href="/" className="shrink-0 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-sm" aria-label="Home">
//           <img src={logo} alt="Crescita Logo" className="h-8 w-auto object-contain" />
//         </a>
//       </header>

//       {/* Main Content Area */}
//       <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
//         <div className="bg-white w-full max-w-md border border-gray-100 rounded-md shadow-xl p-6 sm:p-10 transition-all">
//           <div className="text-center mb-8">
//             <h1
//               className="text-3xl font-serif text-gray-900 tracking-tight"
//               style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
//             >
//               Admin Portal
//             </h1>
//             <p className="text-xs text-gray-400 mt-2 uppercase tracking-widest">
//               Sign in to manage your workspace
//             </p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-5">
//             {/* Email Field */}
//             <div>
//               <label htmlFor="admin-email" className="block text-[11px] font-medium tracking-wider uppercase text-gray-500 mb-1.5">
//                 Email Address
//               </label>
//               <div className="relative">
//                 <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
//                 <input
//                   id="admin-email"
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   autoComplete="email"
//                   placeholder="admin@crescita.in"
//                   className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50/50 border border-gray-200 rounded-md outline-none focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all placeholder:text-gray-300"
//                 />
//               </div>
//             </div>

//             {/* Password Field */}
//             <div>
//               <label htmlFor="admin-password font-medium" className="block text-[11px] tracking-wider uppercase text-gray-500 mb-1.5">
//                 Password
//               </label>
//               <div className="relative">
//                 <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
//                 <input
//                   id="admin-password"
//                   type={showPass ? "text" : "password"}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   autoComplete="current-password"
//                   placeholder="••••••••"
//                   className="w-full pl-10 pr-10 py-2.5 text-sm bg-gray-50/50 border border-gray-200 rounded-md outline-none focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all placeholder:text-gray-300"
//                 />
//                 <button
//                   type="button"
//                   tabIndex={-1}
//                   onClick={() => setShowPass(!showPass)}
//                   aria-label={showPass ? "Hide password" : "Show password"}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
//                 >
//                   {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
//                 </button>
//               </div>
//             </div>

//             {/* Error Message */}
//             {error && (
//               <div role="alert" className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-3 rounded-md border border-red-100 animate-fadeIn">
//                 <AlertCircle size={15} className="shrink-0" />
//                 <span>{error}</span>
//               </div>
//             )}

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-3 bg-gray-900 text-white text-xs font-medium tracking-widest uppercase rounded-md hover:bg-gray-800 focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
//             >
//               {loading ? (
//                 <>
//                   <Loader2 size={16} className="animate-spin" />
//                   <span>Signing in…</span>
//                 </>
//               ) : (
//                 "Sign In"
//               )}
//             </button>
//           </form>
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="py-4 text-center">
//         <p className="text-xs text-gray-400">
//           © {new Date().getFullYear()} Crescita · Admin access only
//         </p>
//       </footer>
//     </div>
//   );
// };

// export default AdminLogin;