"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { UserPlus, Mail, Lock, Eye, EyeOff, Loader2, AlertTriangle, CheckCircle2, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { adminAuthService, AdminUserCreate } from "@/services/adminAuthService";
import { UserRole } from "@/types/admin";
import { toastService } from "@/services/toastService";

const formSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm password"),
  role: z.nativeEnum(UserRole),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

const PasswordStrengthIndicator = ({ password }: { password?: string }) => {
  const [strength, setStrength] = useState({ score: 0, label: "Weak", color: "bg-red-500" });

  useEffect(() => {
    if (!password) {
      setStrength({ score: 0, label: "Weak", color: "bg-red-500" });
      return;
    }
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    let label = "Weak";
    let color = "bg-red-500";
    if (score >= 3) { label = "Medium"; color = "bg-amber-500"; }
    if (score >= 4) { label = "Strong"; color = "bg-emerald-500"; }
    setStrength({ score, label, color });
  }, [password]);

  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full">
        <div className={cn("h-2 rounded-full transition-all duration-300", strength.color)} style={{ width: `${strength.score * 20}%` }} />
      </div>
      <span className="text-xs font-medium text-slate-600 dark:text-slate-400 w-16 text-right">{strength.label}</span>
    </div>
  );
};

export default function CreateAdminPage() {
  const router = useRouter();
  const { isSuperAdmin } = useAdminAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "", confirmPassword: "", role: UserRole.ADMIN },
  });

  const passwordValue = form.watch("password");

  const onSubmit = async (data: FormValues) => {
    if (!isSuperAdmin) {
      setError("Only superadmins can create new admin users.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");

    const adminData: AdminUserCreate = {
      email: data.email,
      password: data.password,
      role: data.role,
    };

    try {
      const response = await adminAuthService.createAdminUser(adminData);
      setSuccess(`Admin user ${response.data.email} created successfully with role ${response.data.role}.`);
      toastService.success("Admin user created successfully!");
      form.reset();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create admin user.";
      setError(errorMessage);
      toastService.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <AlertTriangle className="w-12 h-12 mb-4 text-red-500" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Access Denied</h2>
        <p className="text-slate-600 dark:text-slate-400">Only superadmin users can create new admin accounts.</p>
        <button onClick={() => router.push('/admin-panel')} className="mt-6 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="overflow-hidden border shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-slate-400/20 dark:border-slate-400/10 rounded-2xl shadow-slate-900/5 dark:shadow-black/10">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 text-blue-500 rounded-lg bg-blue-500/10 dark:bg-blue-400/10 dark:text-blue-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Create Admin User</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">Create new admin user accounts (Superadmin only)</p>
            </div>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute w-5 h-5 -translate-y-1/2 left-3 top-1/2 text-slate-400" />
              <input id="email" type="email" {...form.register("email")} className={cn("w-full h-11 pl-10 pr-4 bg-white border rounded-lg dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500", form.formState.errors.email && "border-red-500")} />
            </div>
            {form.formState.errors.email && <p className="mt-1 text-xs text-red-600">{form.formState.errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password"  className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
            <div className="relative">
              <Lock className="absolute w-5 h-5 -translate-y-1/2 left-3 top-1/2 text-slate-400" />
              <input id="password" type={showPassword ? "text" : "password"} {...form.register("password")} className={cn("w-full h-11 pl-10 pr-10 bg-white border rounded-lg dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500", form.formState.errors.password && "border-red-500")} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute -translate-y-1/2 right-3 top-1/2 text-slate-400 hover:text-slate-600"><Eye className="w-5 h-5" /></button>
            </div>
            <PasswordStrengthIndicator password={passwordValue} />
            {form.formState.errors.password && <p className="mt-1 text-xs text-red-600">{form.formState.errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword"  className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute w-5 h-5 -translate-y-1/2 left-3 top-1/2 text-slate-400" />
              <input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} {...form.register("confirmPassword")} className={cn("w-full h-11 pl-10 pr-10 bg-white border rounded-lg dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500", form.formState.errors.confirmPassword && "border-red-500")} />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute -translate-y-1/2 right-3 top-1/2 text-slate-400 hover:text-slate-600"><Eye className="w-5 h-5" /></button>
            </div>
            {form.formState.errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{form.formState.errors.confirmPassword.message}</p>}
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role" className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">Admin Role</label>
            <select id="role" {...form.register("role")} className="w-full h-11 px-3 bg-white border rounded-lg dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value={UserRole.ADMIN}>Admin</option>
              <option value={UserRole.SUPERADMIN}>Super Admin</option>
            </select>
          </div>

          {/* Messages */}
          {success && (
            <div className="flex items-start gap-3 p-3 text-sm font-medium text-emerald-800 border rounded-lg dark:text-emerald-300 bg-emerald-500/10 border-emerald-500/20">
              <CheckCircle2 className="w-5 h-5 mt-0.5" />
              {success}
            </div>
          )}
          {error && (
            <div className="flex items-start gap-3 p-3 text-sm font-medium text-red-800 border rounded-lg dark:text-red-400 bg-red-500/10 border-red-500/20">
              <AlertTriangle className="w-5 h-5 mt-0.5" />
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button type="button" onClick={() => router.push('/admin-panel')} className="px-4 py-2 text-sm font-medium bg-white border rounded-lg text-slate-700 dark:text-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600">
              Back to Panel
            </button>
            <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              {loading ? "Creating..." : "Create Admin User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}