import { AdminLoginForm } from "@/components/auth/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-bolt-white to-bolt-light-blue dark:from-bolt-black dark:to-bolt-medium-black transition-colors duration-300">
      <AdminLoginForm />
    </div>
  );
}