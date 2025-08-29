"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

function ResetPasswordContent() {
  const [state, setState] = useState<"form" | "success" | "invalid">("form");
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({ new: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    // Mock token validation
    if (!token || token === "invalid") {
      setState("invalid");
    } else {
      setState("form");
    }
  }, [searchParams]);

  const validate = () => {
    const newErrors = { new: "", confirm: "" };
    let isValid = true;

    if (!newPassword) {
      newErrors.new = "New password is required";
      isValid = false;
    } else if (newPassword.length < 8) {
      newErrors.new = "Password must be at least 8 characters long";
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirm = "Please confirm your password";
      isValid = false;
    } else if (newPassword && newPassword !== confirmPassword) {
      newErrors.confirm = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setState("success");
    }, 2000);
  };

  const renderFormState = () => (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-bolt-white">
          Reset Password
        </h2>
        <p className="text-bolt-light-blue mt-2 text-sm">
          Enter your new password below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* New Password Field */}
        <div className="space-y-2">
          <label
            htmlFor="new-password"
            className="text-sm font-medium text-bolt-light-blue"
          >
            New Password
          </label>
          <div className="relative">
            <input
              id="new-password"
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className={cn(
                "w-full h-12 px-4 text-sm text-bolt-white bg-bolt-light-blue/20 border rounded-lg backdrop-blur-sm transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-bolt-blue",
                errors.new
                  ? "border-bolt-cyan"
                  : "border-bolt-purple/30 focus:border-bolt-blue"
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-bolt-light-blue/70 hover:text-bolt-light-blue"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.new && (
            <div className="flex items-center text-sm text-bolt-cyan gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>{errors.new}</span>
            </div>
          )}
        </div>

        {/* Confirm New Password Field */}
        <div className="space-y-2">
          <label
            htmlFor="confirm-password"
            className="text-sm font-medium text-bolt-light-blue"
          >
            Confirm New Password
          </label>
          <div className="relative">
            <input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className={cn(
                "w-full h-12 px-4 text-sm text-bolt-white bg-bolt-light-blue/20 border rounded-lg backdrop-blur-sm transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-bolt-blue",
                errors.confirm
                  ? "border-bolt-cyan"
                  : "border-bolt-purple/30 focus:border-bolt-blue"
              )}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-bolt-light-blue/70 hover:text-bolt-light-blue"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.confirm && (
            <div className="flex items-center text-sm text-bolt-cyan gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>{errors.confirm}</span>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 flex items-center justify-center px-4 text-sm font-medium text-bolt-white bg-bolt-blue hover:bg-bolt-mid-blue rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bolt-black focus:ring-bolt-blue disabled:bg-bolt-blue/50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-bolt-cyan" />
          ) : (
            "Reset Password"
          )}
        </button>
      </form>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={() => router.push("/login")}
          className="text-sm font-medium text-bolt-dark-purple hover:underline"
        >
          Back to Login
        </button>
        <button
          onClick={() => router.push("/forgot-password")}
          className="text-sm font-medium text-bolt-dark-purple hover:underline"
        >
          Request New Link
        </button>
      </div>
    </div>
  );

  const renderSuccessState = () => (
    <div className="text-center">
      <CheckCircle className="w-16 h-16 text-bolt-purple mx-auto mb-6" />
      <h2 className="text-2xl font-semibold text-bolt-white">
        Password Reset Successfully!
      </h2>
      <p className="text-bolt-light-blue mt-4 text-sm">
        Your password has been updated. You can now log in with your new
        password.
      </p>
      <button
        onClick={() => router.push("/login")}
        className="mt-8 w-full h-12 flex items-center justify-center px-4 text-sm font-medium text-bolt-white bg-bolt-blue hover:bg-bolt-mid-blue rounded-lg transition-colors duration-300"
      >
        Go to Login
      </button>
    </div>
  );

  const renderInvalidState = () => (
    <div className="text-center">
      <XCircle className="w-16 h-16 text-bolt-cyan mx-auto mb-6" />
      <h2 className="text-2xl font-semibold text-bolt-white">
        Invalid Reset Link
      </h2>
      <p className="text-bolt-light-blue mt-4 text-sm">
        The password reset link is invalid or has expired.
      </p>
      <button
        onClick={() => router.push("/forgot-password")}
        className="mt-8 w-full h-12 flex items-center justify-center px-4 text-sm font-medium text-bolt-white bg-bolt-blue hover:bg-bolt-mid-blue rounded-lg transition-colors duration-300"
      >
        Request New Reset Link
      </button>
    </div>
  );

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-5 overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-bolt-black via-bolt-dark-purple to-bolt-blue -z-10" />
      <div className="w-full max-w-md rounded-2xl border border-bolt-purple/20 bg-white/10 p-8 sm:p-10 shadow-2xl shadow-bolt-black/25 backdrop-blur-xl">
        {state === "form" && renderFormState()}
        {state === "success" && renderSuccessState()}
        {state === "invalid" && renderInvalidState()}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="relative min-h-screen w-full flex items-center justify-center p-5 overflow-hidden">
          <div className="fixed inset-0 bg-gradient-to-br from-bolt-black via-bolt-dark-purple to-bolt-blue -z-10" />
          <Loader2 className="w-8 h-8 animate-spin text-bolt-white" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}