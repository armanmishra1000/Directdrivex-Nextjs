"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
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
import { GoogleIcon } from "@/components/icons/GoogleIcon";

const formSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = form;

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    console.log("Login data:", data);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate success or error
    if (data.email === "error@example.com") {
      toast.error("Login failed. Please check your credentials.");
    } else {
      toast.success("Login successful! Redirecting...");
      // router.push('/dashboard');
    }

    setIsLoading(false);
  };

  const getErrorClass = (field: keyof FormValues) =>
    errors[field] && touchedFields[field]
      ? "border-red-500 bg-red-50/50 focus:border-red-500 focus:ring-red-500/20"
      : "border-slate-300 focus:border-bolt-blue focus:ring-bolt-blue/20";

  return (
    <div className="w-full p-6 sm:p-8 bg-white/[.95] backdrop-blur border border-white/[.2] shadow-glass rounded-2xl">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">
          Sign in to your account
        </h2>
        <p className="text-slate-600 mt-2">Access your secure file storage</p>
      </div>

      <div className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                {...register("email")}
                placeholder="Enter your email"
                className={cn(
                  "w-full h-11 pl-10 pr-4 py-2 text-sm text-slate-900 bg-white border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2",
                  getErrorClass("email")
                )}
                autoComplete="email"
              />
            </div>
            {errors.email && touchedFields.email && (
              <div className="flex items-center text-sm text-red-600 gap-1.5">
                <AlertCircle className="w-4 h-4" />
                {errors.email.message}
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
                {...register("password")}
                placeholder="Enter your password"
                className={cn(
                  "w-full h-11 pl-10 pr-10 py-2 text-sm text-slate-900 bg-white border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2",
                  getErrorClass("password")
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
            {errors.password && touchedFields.password && (
              <div className="flex items-center text-sm text-red-600 gap-1.5">
                <AlertCircle className="w-4 h-4" />
                {errors.password.message}
              </div>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <input
                id="rememberMe"
                type="checkbox"
                {...register("rememberMe")}
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
              className="font-medium text-bolt-blue hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-bolt-blue hover:bg-bolt-blue/90 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bolt-blue disabled:bg-bolt-blue/50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
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
            <span className="bg-white/[.95] px-2 text-slate-500">or</span>
          </div>
        </div>

        {/* Social Login */}
        <button
          type="button"
          className="w-full h-11 flex items-center justify-center px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400"
        >
          <GoogleIcon className="w-5 h-5 mr-3" />
          Continue with Google
        </button>

        {/* Register Link */}
        <div className="text-center">
          <p className="text-sm text-slate-600">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-bolt-blue hover:underline"
            >
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}