import { useState } from 'react';
import { CleanupResult } from '@/types/cleanup';
import { storageCleanupService } from '@/services/admin/storageCleanupService';
import { toast } from 'sonner';

interface UseStorageCleanupReturn {
  loading: boolean;
  result: CleanupResult | null;
  logs: string[];
  useHardDelete: boolean;
  setUseHardDelete: (value: boolean) => void;
  runCleanup: () => Promise<void>;
  appendLog: (message: string) => void;
  clearResults: () => void;
}

export function useStorageCleanup(): UseStorageCleanupReturn {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CleanupResult | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [useHardDelete, setUseHardDelete] = useState(false);

  const appendLog = (line: string) => {
    const stamp = new Date().toLocaleString();
    setLogs(prev => [`[${stamp}] ${line}`, ...prev]);
  };

  const runCleanup = async () => {
    // Safety confirmation
    const confirmMessage = `Are you sure you want to run a ${useHardDelete ? 'HARD' : 'SOFT'} reset? This cannot be undone.`;
    if (!confirm(confirmMessage)) {
      return;
    }

    setLoading(true);
    setResult(null);
    setLogs([]);
    
    try {
      appendLog(`Starting ${useHardDelete ? 'HARD' : 'SOFT'} storage reset...`);

      // Use demo mode in development, real API in production
      const isDemoMode = process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_API_BASE_URL;
      
      const cleanupResult = isDemoMode 
        ? await storageCleanupService.runStorageCleanupDemo(useHardDelete)
        : await storageCleanupService.runStorageCleanup(useHardDelete);

      setResult(cleanupResult);
      
      // Log results
      appendLog(`Reset completed: ${cleanupResult.message}`);
      appendLog(`GDrive deleted=${cleanupResult.gdrive.summary.deleted}, errors=${cleanupResult.gdrive.summary.errors}`);
      
      Object.entries(cleanupResult.gdrive.per_account || {}).forEach(([account, info]) => {
        appendLog(`Account ${account}: deleted=${info.deleted}, errors=${info.errors}${info.message ? `, note=${info.message}` : ''}`);
      });
      
      appendLog(`DB files marked deleted=${cleanupResult.files_marked_deleted}, hard deleted=${cleanupResult.files_hard_deleted}, batches deleted=${cleanupResult.batches_deleted}`);

      // Show success notification
      toast.success(
        `Storage cleanup completed: ${cleanupResult.gdrive.summary.deleted} files processed`,
        {
          description: `Mode: ${cleanupResult.mode.toUpperCase()}, Errors: ${cleanupResult.gdrive.summary.errors}`,
          duration: 5000
        }
      );

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Storage cleanup failed';
      appendLog(`Reset failed: ${errorMessage}`);
      
      toast.error('Storage cleanup failed', {
        description: errorMessage,
        duration: 7000
      });

      console.error('Storage cleanup error:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResult(null);
    setLogs([]);
  };

  return {
    loading,
    result,
    logs,
    useHardDelete,
    setUseHardDelete,
    runCleanup,
    appendLog,
    clearResults
  };
}
