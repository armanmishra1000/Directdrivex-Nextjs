"use client";

import { useState, useEffect, useCallback } from 'react';
import { BatchDetails, UseBatchDownloadReturn } from '@/types/batch-download';
import { toastService } from '@/services/toastService';

// Import the service class and create instance
import { BatchUploadService } from '@/services/batchUploadService';

// Create service instance
const batchUploadService = new BatchUploadService();

export function useBatchDownload(batchId: string | null): UseBatchDownloadReturn {
  const [batchDetails, setBatchDetails] = useState<BatchDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zipDownloadUrl, setZipDownloadUrl] = useState<string | null>(null);

  const formatFileSize = useCallback((bytes: number): string => {
    return batchUploadService.formatFileSize(bytes);
  }, []);

  const getFileDownloadUrl = useCallback((fileId: string): string => {
    return batchUploadService.getStreamUrl(fileId);
  }, []);

  const loadBatchDetails = useCallback(async () => {
    if (!batchId) {
      setError('No batch ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading batch details for ID:', batchId);
      
      // Load batch details
      const details = await batchUploadService.getBatchDetails(batchId);
      setBatchDetails(details);
      
      // Get ZIP download URL
      const zipUrl = await batchUploadService.getZipDownloadUrlWithAuth(batchId);
      setZipDownloadUrl(zipUrl);
      
      console.log('Batch details loaded successfully:', details);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load batch details';
      console.error('Error loading batch details:', errorMessage);
      setError(errorMessage);
      toastService.error(`Failed to load batch: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [batchId]);

  const retry = useCallback(async () => {
    await loadBatchDetails();
  }, [loadBatchDetails]);

  // Load batch details on mount or when batchId changes
  useEffect(() => {
    loadBatchDetails();
  }, [loadBatchDetails]);

  return {
    batchDetails,
    loading,
    error,
    retry,
    zipDownloadUrl,
    getFileDownloadUrl,
    formatFileSize,
  };
}