import { QuotaInfo } from '@/types/api';
import { Loader2 } from 'lucide-react';

interface QuotaDisplayProps {
  quotaInfo: QuotaInfo | null;
  loading: boolean;
}

export function QuotaDisplay({ quotaInfo, loading }: QuotaDisplayProps) {
  if (loading) {
    return (
      <div className="p-3 mb-4 border bg-gradient-to-r from-bolt-light-blue/20 to-white border-bolt-blue/30 rounded-xl">
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="w-4 h-4 animate-spin text-bolt-blue" />
          <span className="text-sm text-slate-600">Loading quota information...</span>
        </div>
      </div>
    );
  }

  if (!quotaInfo) {
    return null;
  }

  const getQuotaStatusColor = (percentage: number): string => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-orange-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getQuotaStatusText = (percentage: number): string => {
    if (percentage >= 90) return 'Critical';
    if (percentage >= 75) return 'Warning';
    if (percentage >= 50) return 'Moderate';
    return 'Good';
  };

  return (
    <div className="p-3 mb-4 border bg-gradient-to-r from-bolt-light-blue/20 to-white border-bolt-blue/30 rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-700">Daily Usage</span>
        <span className="text-sm font-bold text-bolt-blue">
          {quotaInfo.current_usage_gb.toFixed(1)}GB / {quotaInfo.daily_limit_gb}GB
        </span>
      </div>
      
      <div className="w-full h-2 mb-2 rounded-full bg-slate-200">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${getQuotaStatusColor(quotaInfo.usage_percentage)}`}
          style={{ width: `${Math.min(quotaInfo.usage_percentage, 100)}%` }}
        ></div>
      </div>
      
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">
          {quotaInfo.remaining_gb.toFixed(1)}GB remaining today
        </p>
        <span className={`text-xs px-2 py-1 rounded-full text-white font-medium ${getQuotaStatusColor(quotaInfo.usage_percentage)}`}>
          {getQuotaStatusText(quotaInfo.usage_percentage)}
        </span>
      </div>
      
      <div className="mt-2 text-xs text-slate-500">
        <span className={`inline-flex items-center px-2 py-1 rounded-full ${
          quotaInfo.user_type === 'authenticated' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {quotaInfo.user_type === 'authenticated' ? '✨ Premium User' : '👤 Guest User'}
        </span>
      </div>
    </div>
  );
}
