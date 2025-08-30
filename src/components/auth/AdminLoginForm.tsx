"use client";

import { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff, Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const PasswordStrengthIndicator = ({ password }: { password?: string }) => {
  const [strength, setStrength] = useState({ score: 0, label: "", color: "" });

  useEffect(() => {
    let score = 0;
    let label = "Weak";
    let color = "bg-red-500";

    if (password) {
      if (password.length >= 8) score++;
      if (/[a-z]/.test(password)) score++;
      if (/[A-Z]/.test(password)) score++;
      if (/[0-9]/.test(password)) score++;
      if (/[^A-Za-z0-9]/.test(password)) score++;
    }

    if (score > 2) {
      label = "Medium";
      color = "bg-yellow-500";
    }
    if (score > 3) {
      label = "Strong";
      color = "bg-bolt-purple";
    }

    setStrength({ score, label, color });
  }, [password]);

  if (!password) return null;

  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="w-full bg-slate-200 dark:bg-bolt-medium-black/50 rounded-full h-1.5">
        <div
          className={cn("h-1.5 rounded-full transition-all", strength.color)}
          style={{ width: `${(strength.score / 5) * 100}%` }}
        />
      </div>
      <span className="text-xs font-medium text-slate-600 dark:text-bolt-light-blue w-16 text-right">
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

    // Simulate API call
    setTimeout(() => {
      if (email === "admin@mfcnextgen.com" && password === "password") {
        // In a real app, you'd redirect here
      } else {
        setError("Invalid credentials. Please try again.");
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="relative w-full max-w-md p-8 space-y-8 bg-white/95 dark:bg-bolt-medium-black/95 backdrop-blur-xl border border-bolt-blue/10 dark:border-bolt-cyan/20 rounded-2xl shadow-2xl shadow-bolt-blue/10 dark:shadow-bolt-cyan/10">
      <div className="absolute top-4 left-4">
        <ThemeToggle />
      </div>
      <div className="absolute top-4 right-4">
        <div className="px-3 py-1 text-xs font-bold text-white uppercase tracking-wider bg-gradient-to-r from-bolt-blue to-bolt-dark-purple dark:from-bolt-cyan dark:to-bolt-purple rounded-full animate-pulse">
          Admin Panel
        </div>
      </div>

      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-bolt-black dark:text-bolt-white">
          Admin Access
        </h1>
        <p className="mt-2 text-base font-medium text-bolt-medium-black dark:text-bolt-light-blue/80">
          Secure administrative portal
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-3 text-sm font-medium text-red-800 dark:text-red-200 bg-red-500/10 border border-red-500/20 rounded-lg animate-shake">
          <AlertTriangle className="w-5 h-5" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="peer h-14 w-full rounded-xl border-2 border-slate-300 dark:border-bolt-medium-black bg-slate-100/50 dark:bg-bolt-cyan/10 px-4 pt-4 text-base text-bolt-black dark:text-bolt-white placeholder-transparent transition-colors focus:border-bolt-blue dark:focus:border-bolt-cyan focus:outline-none"
            placeholder="admin@company.com"
            required
          />
          <label
            htmlFor="email"
            className="absolute left-4 top-2 text-xs font-semibold text-bolt-medium-black dark:text-bolt-light-blue transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs"
          >
            Email Address
          </label>
          <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-bolt-light-blue/50" />
        </div>

        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="peer h-14 w-full rounded-xl border-2 border-slate-300 dark:border-bolt-medium-black bg-slate-100/50 dark:bg-bolt-cyan/10 px-4 pt-4 text-base text-bolt-black dark:text-bolt-white placeholder-transparent transition-colors focus:border-bolt-blue dark:focus:border-bolt-cyan focus:outline-none"
            placeholder="Enter admin password"
            required
          />
          <label
            htmlFor="password"
            className="absolute left-4 top-2 text-xs font-semibold text-bolt-medium-black dark:text-bolt-light-blue transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs"
          >
            Password
          </label>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-bolt-light-blue/70 dark:hover:text-bolt-light-blue"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
          <PasswordStrengthIndicator password={password} />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-14 flex items-center justify-center rounded-xl text-base font-semibold text-white bg-gradient-to-r from-bolt-blue to-bolt-mid-blue dark:from-bolt-cyan dark:to-bolt-blue transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-bolt-blue/20 dark:hover:shadow-bolt-cyan/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <div className="text-center">
        <button className="text-sm font-medium text-bolt-dark-purple dark:text-bolt-purple hover:underline">
          Switch to User Login
        </button>
      </div>
    </div>
  );
}