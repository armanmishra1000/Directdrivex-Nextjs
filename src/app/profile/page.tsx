"use client";

import { useState, useEffect } from "react";
import {
  User,
  CloudUpload,
  Star,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  ChevronRight,
  LogOut,
  Home,
  FileCog,
  Loader2,
  AlertTriangle,
  RefreshCw,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for the profile page
const mockUserProfile = {
  email: "user@directdrive.com",
  accountType: "Basic Account",
  memberSince: "2023-01-15T10:00:00Z",
  storageUsedGB: 6.8,
  storageBreakdown: {
    documents: 1.2,
    images: 3.5,
    videos: 2.0,
    other: 0.1,
  },
};

export default function ProfilePage() {
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<typeof mockUserProfile | null>(
    null
  );
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordErrors, setPasswordErrors] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [passwordUpdateLoading, setPasswordUpdateLoading] = useState(false);

  const fetchProfile = () => {
    setProfileLoading(true);
    setProfileError(null);
    setTimeout(() => {
      // To test error state, uncomment the line below
      // setProfileError("Network error. Please check your connection.");
      setUserProfile(mockUserProfile);
      setProfileLoading(false);
    }, 1500);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleShowPassword = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordUpdateLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Password updated");
      setPasswordUpdateLoading(false);
      setIsChangingPassword(false);
      setPasswordForm({ current: "", new: "", confirm: "" });
    }, 2000);
  };

  const premiumFeatures = [
    "Unlimited storage",
    "ZIP download",
    "Batch upload",
    "Advanced sharing",
    "Priority support",
    "Secure cloud storage",
  ];

  const cardClasses =
    "backdrop-blur-md bg-white/70 border border-white/20 rounded-2xl shadow-xl p-6";

  const renderLoadingState = () => (
    <div className="space-y-6 animate-pulse">
      <div className={cn(cardClasses, "flex items-center space-x-4")}>
        <div className="w-12 h-12 bg-bolt-light-blue rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-bolt-light-blue rounded w-3/4"></div>
          <div className="h-3 bg-bolt-light-blue rounded w-1/2"></div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className={cn(cardClasses, "space-y-4")}>
          <div className="h-6 bg-bolt-light-blue rounded w-1/2"></div>
          <div className="h-4 bg-bolt-light-blue rounded w-full"></div>
          <div className="h-4 bg-bolt-light-blue rounded w-full"></div>
          <div className="h-4 bg-bolt-light-blue rounded w-5/6"></div>
        </div>
        <div className={cn(cardClasses, "space-y-4")}>
          <div className="h-6 bg-bolt-light-blue rounded w-1/2"></div>
          <div className="h-4 bg-bolt-light-blue rounded w-full"></div>
          <div className="h-4 bg-bolt-light-blue rounded w-full"></div>
          <div className="h-4 bg-bolt-light-blue rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );

  const renderErrorState = () => (
    <div className={cardClasses}>
      <div className="text-center py-8">
        <AlertTriangle className="w-10 h-10 text-bolt-blue mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-bolt-black mb-2">
          Failed to Load Profile
        </h3>
        <p className="text-bolt-medium-black mb-6">{profileError}</p>
        <button
          onClick={fetchProfile}
          className="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-white bg-bolt-blue hover:bg-bolt-blue/90 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </button>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      {/* User Overview Card */}
      <div className={cn(cardClasses, "flex items-center space-x-4")}>
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-300 flex items-center justify-center">
          <User className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="font-semibold text-bolt-black">{userProfile?.email}</p>
          <span className="inline-block mt-1 text-xs font-medium text-white px-2.5 py-1 rounded-full bg-gradient-to-r from-blue-500 to-blue-300">
            ⭐ {userProfile?.accountType}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Storage Usage Card */}
        <div className={cn(cardClasses, "space-y-4")}>
          <div className="flex items-center space-x-3">
            <CloudUpload className="w-5 h-5 text-bolt-blue" />
            <h3 className="text-lg font-semibold text-bolt-black">
              Storage Usage
            </h3>
          </div>
          <div>
            <p className="text-2xl font-bold text-bolt-black">
              {userProfile?.storageUsedGB} GB
            </p>
            <p className="text-sm text-bolt-medium-black">
              Unlimited storage available
            </p>
          </div>
          <div className="border-t border-white/50 pt-4 space-y-2 text-sm">
            <h4 className="font-semibold text-bolt-black mb-2">
              Storage Breakdown
            </h4>
            <div className="flex justify-between">
              <span className="text-bolt-medium-black">Documents</span>
              <span className="font-medium text-bolt-black">
                {userProfile?.storageBreakdown.documents} GB
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-bolt-medium-black">Images</span>
              <span className="font-medium text-bolt-black">
                {userProfile?.storageBreakdown.images} GB
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-bolt-medium-black">Videos</span>
              <span className="font-medium text-bolt-black">
                {userProfile?.storageBreakdown.videos} GB
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-bolt-medium-black">Other</span>
              <span className="font-medium text-bolt-black">
                {userProfile?.storageBreakdown.other} GB
              </span>
            </div>
          </div>
        </div>

        {/* Account Information Card */}
        <div className={cn(cardClasses, "space-y-4")}>
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-bolt-blue" />
            <h3 className="text-lg font-semibold text-bolt-black">
              Account Information
            </h3>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-bolt-medium-black">Email Address</p>
              <p className="font-medium text-bolt-black">{userProfile?.email}</p>
            </div>
            <div>
              <p className="text-bolt-medium-black">Account Type</p>
              <p className="font-medium text-bolt-black">
                {userProfile?.accountType}
              </p>
            </div>
            <div>
              <p className="text-bolt-medium-black">Member Since</p>
              <p className="font-medium text-bolt-black">
                {new Date(
                  userProfile?.memberSince || ""
                ).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Features Card */}
      <div className={cn(cardClasses, "md:col-span-2")}>
        <div className="flex items-center space-x-3 mb-4">
          <Star className="w-5 h-5 text-bolt-blue" />
          <h3 className="text-lg font-semibold text-bolt-black">
            Premium Features
          </h3>
        </div>
        <p className="text-sm text-bolt-medium-black mb-4">
          You have access to all premium features.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {premiumFeatures.map((feature) => (
            <div
              key={feature}
              className="flex items-center space-x-2 border border-gray-300 rounded-lg p-3"
            >
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-bolt-black">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Password Change Form */}
      {isChangingPassword && (
        <div className={cn(cardClasses, "md:col-span-2")}>
          <h3 className="text-lg font-semibold text-bolt-black mb-4">
            Change Your Password
          </h3>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            {/* Current Password */}
            <div className="space-y-1">
              <label
                htmlFor="current"
                className="text-sm font-medium text-bolt-black"
              >
                Current Password
              </label>
              <div className="relative">
                <input
                  id="current"
                  name="current"
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordForm.current}
                  onChange={handlePasswordChange}
                  className="w-full h-11 pl-4 pr-10 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bolt-blue/20 focus:border-bolt-blue"
                />
                <button
                  type="button"
                  onClick={() => toggleShowPassword("current")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPasswords.current ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            {/* New Password */}
            <div className="space-y-1">
              <label
                htmlFor="new"
                className="text-sm font-medium text-bolt-black"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id="new"
                  name="new"
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordForm.new}
                  onChange={handlePasswordChange}
                  className="w-full h-11 pl-4 pr-10 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bolt-blue/20 focus:border-bolt-blue"
                />
                <button
                  type="button"
                  onClick={() => toggleShowPassword("new")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPasswords.new ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            {/* Confirm Password */}
            <div className="space-y-1">
              <label
                htmlFor="confirm"
                className="text-sm font-medium text-bolt-black"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirm"
                  name="confirm"
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordForm.confirm}
                  onChange={handlePasswordChange}
                  className="w-full h-11 pl-4 pr-10 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bolt-blue/20 focus:border-bolt-blue"
                />
                <button
                  type="button"
                  onClick={() => toggleShowPassword("confirm")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsChangingPassword(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={passwordUpdateLoading}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-bolt-blue hover:bg-bolt-blue/90 rounded-lg disabled:opacity-50"
              >
                {passwordUpdateLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Update Password"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Security & Privacy Card */}
        <div className={cn(cardClasses, "space-y-4")}>
          <div className="flex items-center space-x-3">
            <Lock className="w-5 h-5 text-bolt-blue" />
            <h3 className="text-lg font-semibold text-bolt-black">
              Security & Privacy
            </h3>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => setIsChangingPassword(!isChangingPassword)}
              className="w-full flex justify-between items-center text-left p-3 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <span className="font-medium text-bolt-black">
                Change Password
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
            <button
              disabled
              className="w-full flex justify-between items-center text-left p-3 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="font-medium text-bolt-black">
                Two-Factor Authentication
              </span>
              <span className="text-xs bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full">
                Coming Soon
              </span>
            </button>
            <button
              disabled
              className="w-full flex justify-between items-center text-left p-3 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="font-medium text-bolt-black">
                Download My Data
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className={cn(cardClasses, "space-y-4")}>
          <div className="flex items-center space-x-3">
            <Zap className="w-5 h-5 text-bolt-blue" />
            <h3 className="text-lg font-semibold text-bolt-black">
              Quick Actions
            </h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <button className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-bolt-blue to-bolt-mid-blue hover:opacity-90 rounded-lg transition-opacity">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </button>
            <button className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-bolt-blue border border-bolt-blue hover:bg-bolt-blue/10 rounded-lg transition-colors">
              <FileCog className="w-4 h-4 mr-2" />
              Manage Files
            </button>
            <button className="sm:col-span-2 w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 border border-red-300 hover:bg-red-50 rounded-lg transition-colors">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-bolt-white to-bolt-light-blue -z-10" />
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold text-bolt-black">User Profile</h1>
          <p className="text-bolt-medium-black">
            Manage your account settings and storage
          </p>
        </div>
        {profileLoading
          ? renderLoadingState()
          : profileError
          ? renderErrorState()
          : renderProfile()}
      </main>
    </div>
  );
}