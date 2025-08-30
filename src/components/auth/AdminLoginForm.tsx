"use client";

import { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff, Loader2, AlertTriangle, ShieldCheck, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const PasswordStrengthIndicator = ({ password }: { password?: string }) => {
  const [strength, setStrength] = useState({ score: 0, label: "Weak", color: "bg-red-500" });

  useEffect(() => {
    let score = 0;
    if (!password) {
      setStrength({ score: 0, label: "Weak", color: "bg-red-500" });
      return;
    }
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    let label = "Weak";
    let color = "from-red-500 to-red-600";
    if (score >= 3) {
      label = "Fair";
      color = "from-amber-500 to-amber-600";
    }
    if (score >= 4) {
      label = "Good";
      color = "from-emerald-500 to-emerald-600";
    }
    if (score >= 5) {
      label = "Strong";
      color = "from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-violet-400";
    }
    setStrength({ score, label, color });
  }, [password]);

  return (
    <div className="flex items-center gap-3 mt-3">
      <div className="w-full bg-slate-200 dark:bg-slate-700/60 rounded-full h-1.5 flex gap-1 p-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-full w-1/5 rounded-full transition-all duration-300",
              i < strength.score ? `bg-gradient-to-r ${strength.color}` : "bg-transparent"
            )}
          />
        ))}
      </div>
      <span className="text-xs font-medium text-slate-600 dark:text-slate-300 w-16 text-right">
        {strength.label}
      </span>
    </div>
  );
};

export function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (email === "admin@enterprise.com" && password === "AdminPass123!") {
        // Successful login logic
      } else {
        setError("Invalid credentials. Please check your email and passphrase.");
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="relative w-full max-w-md p-8 sm:p-10 space-y-8 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-400/20 dark:border-slate-400/10 rounded-2xl shadow-2xl shadow-slate-900/10 dark:shadow-black/20">
      <div className="absolute top-4 left-4">
        <ThemeToggle />
      </div>
      <div className="absolute top-4 right-4">
        <div className="px-3 py-1 text-[11px] font-bold text-white uppercase tracking-widest bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-violet-400 rounded-full animate-pulse">
          Enterprise
        </div>
      </div>

      <div className="text-center space-y-4">
        <div className="inline-block p-3 bg-gradient-to-br from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-violet-400 rounded-full shadow-lg">
          <ShieldCheck className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Administrative Portal
        </h1>
        <p className="text-base font-medium text-slate-600 dark:text-slate-300">
          Secure Management Console
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-3 text-sm font-medium text-red-800 dark:text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg animate-shake">
          <AlertTriangle className="w-5 h-5" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-300 peer-focus:text-blue-500 dark:peer-focus:text-blue-400 transition-colors" />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="peer h-14 w-full rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-700/60 pl-12 pr-4 text-base text-slate-900 dark:text-slate-50 placeholder-transparent transition-colors focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none"
            placeholder="admin@enterprise.com"
            required
          />
          <label
            htmlFor="email"
            className="absolute left-12 -top-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-1 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:left-12 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:left-11 peer-focus:text-xs peer-focus:text-blue-500 dark:peer-focus:text-blue-400"
          >
            Administrator Email
          </label>
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-300 peer-focus:text-blue-500 dark:peer-focus:text-blue-400 transition-colors" />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="peer h-14 w-full rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-700/60 pl-12 pr-12 text-base text-slate-900 dark:text-slate-50 placeholder-transparent transition-colors focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none"
            placeholder="Enter admin passphrase"
            required
          />
          <label
            htmlFor="password"
            className="absolute left-12 -top-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-1 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:left-12 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:left-11 peer-focus:text-xs peer-focus:text-blue-500 dark:peer-focus:text-blue-400"
          >
            Security Passphrase
          </label>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-300 dark:hover:text-slate-50"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
          <PasswordStrengthIndicator password={password} />
        </div>

        <div className="flex items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500"/>256-bit Encryption</span>
            <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-emerald-500"/>Session Secured</span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="group w-full h-14 flex items-center justify-center rounded-xl text-base font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 transition-all duration-300 hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-500 dark:hover:to-blue-600 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 dark:hover:shadow-blue-400/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              ADMIN SIGN IN
              <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>

      <div className="text-center">
        <button className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors group relative">
          Switch to User Portal
          <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-blue-500 dark:bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
        </button>
      </div>
    </div>
  );
}