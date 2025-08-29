"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      console.log("Submitting:", { email, password, rememberMe });
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  return (
    <div className="w-full p-6 sm:p-8 bg-white/95 backdrop-blur border border-white/20 shadow-xl rounded-2xl">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">
          Sign in to your account
        </h2>
        <p className="text-slate-600 mt-2">Access your secure file storage</p>
      </div>

      <div className="space-y-6">
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-sm font-medium text-slate-800"
            >
              Email address
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                aria-hidden="true"
              />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={cn(
                  "w-full h-11 pl-10 pr-4 py-2 text-sm text-slate-900 bg-white border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-bolt-blue/20",
                  errors.email
                    ? "border-red-500 bg-red-50/50 focus:border-red-500"
                    : "border-slate-300 focus:border-bolt-blue"
                )}
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <div className="flex items-center text-sm text-red-600 gap-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.email}</span>
              </div>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-slate-800"
            >
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                aria-hidden="true"
              />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={cn(
                  "w-full h-11 pl-10 pr-10 py-2 text-sm text-slate-900 bg-white border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-bolt-blue/20",
                  errors.password
                    ? "border-red-500 bg-red-50/50 focus:border-red-500"
                    : "border-slate-300 focus:border-bolt-blue"
                )}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <div className="flex items-center text-sm text-red-600 gap-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.password}</span>
              </div>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-bolt-blue bg-slate-100 border-slate-300 rounded focus:ring-bolt-blue focus:ring-offset-0"
              />
              <label
                htmlFor="rememberMe"
                className="text-slate-600 cursor-pointer"
              >
                Remember me
              </label>
            </div>
            <Link
              href="/forgot-password"
              className="font-medium text-bolt-blue hover:text-bolt-blue/80"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-bolt-blue hover:bg-bolt-blue/90 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bolt-blue disabled:bg-bolt-blue/50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Sign in
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white/95 px-2 text-slate-500">or</span>
          </div>
        </div>

        {/* Social Login */}
        <button
          type="button"
          className="w-full h-11 flex items-center justify-center px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400"
        >
          <img
            src="/assets/images/google.svg"
            alt="Google"
            className="w-6 h-6 mr-3"
          />
          Continue with Google
        </button>

        {/* Register Link */}
        <div className="text-center">
          <p className="text-sm text-slate-600">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-bolt-blue hover:text-bolt-blue/80"
            >
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}