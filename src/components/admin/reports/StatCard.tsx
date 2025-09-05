import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string;
  label: string;
  icon: LucideIcon;
  colorClass: string;
}

export function StatCard({ title, value, label, icon: Icon, colorClass }: StatCardProps) {
  return (
    <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-slate-400/20 shadow-slate-900/5 dark:shadow-black/10 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</CardTitle>
        <div className={cn("p-2 rounded-lg", colorClass.replace('text-', 'bg-').replace('600', '100').replace('dark:bg-slate-800/95', 'dark:bg-opacity-30'))}>
          <Icon className={cn("w-5 h-5", colorClass)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-slate-900 dark:text-white">{value}</div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{label}</p>
      </CardContent>
    </Card>
  );
}