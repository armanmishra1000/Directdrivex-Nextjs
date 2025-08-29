import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center space-y-6 p-8 bg-white/95 backdrop-blur border border-white/20 shadow-glass rounded-2xl">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
          <h1 className="text-2xl font-bold text-slate-900">Welcome to DirectDrive!</h1>
          <p className="text-slate-600">
            You have successfully authenticated. The dashboard functionality will be implemented here.
          </p>
          <p className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
            Google authentication was successful!
          </p>
          <Link
            href="/register"
            className="inline-flex items-center text-bolt-blue hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Register
          </Link>
        </div>
      </div>
    </div>
  );
}
