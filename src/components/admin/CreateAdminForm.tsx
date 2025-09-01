"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Lock, Eye, EyeOff, Loader2, AlertTriangle, CheckCircle, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { adminAuthService, AdminUserCreate } from "@/services/adminAuthService";
import { UserRole, CreateAdminForm as CreateAdminFormType } from "@/types/admin";
import { toastService } from "@/services/toastService";
import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
  confirmPassword: z.string(),
  role: z.nativeEnum(UserRole),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export function CreateAdminForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      role: UserRole.ADMIN,
    },
  });

  const passwordValue = form.watch("password");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const adminData: AdminUserCreate = {
      email: values.email,
      password: values.password,
      role: values.role,
    };

    try {
      const response = await adminAuthService.createAdminUser(adminData);
      setSuccess(`Admin user ${response.data.email} created successfully with role: ${response.data.role}`);
      toastService.success("Admin user created successfully!");
      form.reset();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      toastService.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl p-6 border shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-slate-400/20 dark:border-slate-400/10 rounded-2xl shadow-slate-900/5 dark:shadow-black/10">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {success && (
          <div className="flex items-start gap-3 p-3 text-sm font-medium text-emerald-800 border rounded-lg dark:text-emerald-300 bg-emerald-500/10 border-emerald-500/20">
            <CheckCircle className="w-5 h-5" />
            <p>{success}</p>
          </div>
        )}
        {error && (
          <div className="flex items-start gap-3 p-3 text-sm font-medium text-red-800 border rounded-lg dark:text-red-300 bg-red-500/10 border-red-500/20">
            <AlertTriangle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
          <div className="relative">
            <Mail className="absolute w-5 h-5 -translate-y-1/2 left-3 top-1/2 text-slate-400" />
            <input {...form.register("email")} id="email" type="email" placeholder="admin@example.com" disabled={loading} className={cn("w-full h-11 pl-10 pr-4 bg-white border rounded-lg dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500", form.formState.errors.email && "border-red-500")} />
          </div>
          {form.formState.errors.email && <p className="mt-1 text-xs text-red-600">{form.formState.errors.email.message}</p>}
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
          <div className="relative">
            <Lock className="absolute w-5 h-5 -translate-y-1/2 left-3 top-1/2 text-slate-400" />
            <input {...form.register("password")} id="password" type={showPassword ? "text" : "password"} placeholder="Enter a secure password" disabled={loading} className={cn("w-full h-11 pl-10 pr-10 bg-white border rounded-lg dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500", form.formState.errors.password && "border-red-500")} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute -translate-y-1/2 right-3 top-1/2 text-slate-400 hover:text-slate-600"><Eye className="w-5 h-5" /></button>
          </div>
          <PasswordStrengthIndicator password={passwordValue} />
          {form.formState.errors.password && <p className="mt-1 text-xs text-red-600">{form.formState.errors.password.message}</p>}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute w-5 h-5 -translate-y-1/2 left-3 top-1/2 text-slate-400" />
            <input {...form.register("confirmPassword")} id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Confirm your password" disabled={loading} className={cn("w-full h-11 pl-10 pr-10 bg-white border rounded-lg dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500", form.formState.errors.confirmPassword && "border-red-500")} />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute -translate-y-1/2 right-3 top-1/2 text-slate-400 hover:text-slate-600"><Eye className="w-5 h-5" /></button>
          </div>
          {form.formState.errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{form.formState.errors.confirmPassword.message}</p>}
        </div>

        {/* Role Selection */}
        <div>
          <label htmlFor="role" className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">Role</label>
          <select {...form.register("role")} id="role" disabled={loading} className="w-full h-11 px-3 bg-white border rounded-lg dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value={UserRole.ADMIN}>Admin (Standard permissions)</option>
            <option value={UserRole.SUPERADMIN}>Super Admin (Full system access)</option>
          </select>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
          <button type="submit" disabled={loading} className="flex items-center justify-center w-full h-12 text-base font-semibold text-white transition-all duration-300 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-70 disabled:cursor-not-allowed">
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Create Admin User"}
          </button>
        </div>
      </form>
    </div>
  );
}