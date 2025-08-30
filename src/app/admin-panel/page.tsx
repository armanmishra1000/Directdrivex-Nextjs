"use client";

import { StatCard } from "@/components/admin/StatCard";
import { UploadActivityChart } from "@/components/admin/UploadActivityChart";
import { StorageDistributionChart } from "@/components/admin/StorageDistributionChart";
import { LiveEventStream } from "@/components/admin/LiveEventStream";
import { Users, File, HardDrive, HeartPulse, HardDriveIcon } from "lucide-react";

export default function AdminDashboardPage() {
  // Mock data will be replaced with service calls
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard title="Total Users" value="1.2K" icon={Users} status="good" />
        <StatCard title="Total Files" value="1.5M" icon={File} status="good" />
        <StatCard title="Total Storage" value="25.8 TB" icon={HardDrive} status="good" />
        <StatCard title="System Health" value="Good" icon={HeartPulse} status="good" />
        <StatCard title="Google Drive" value="80%" icon={HardDriveIcon} status="warning" isGdrive={true} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <UploadActivityChart />
        </div>
        <div className="lg:col-span-2">
          <StorageDistributionChart />
        </div>
      </div>

      {/* Live Event Stream */}
      <LiveEventStream />
    </div>
  );
}