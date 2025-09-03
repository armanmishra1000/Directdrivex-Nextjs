"use client";

import { useState } from 'react';
import { UploadService } from '@/services/uploadService';
import { BatchUploadService } from '@/services/batchUploadService';
import { AuthService } from '@/services/authService';
import { storageCleanupService } from '@/services/admin/storageCleanupService';

const uploadService = new UploadService();
const batchUploadService = new BatchUploadService();
const authService = new AuthService();

export default function TestServicesPage() {
  const [quotaInfo, setQuotaInfo] = useState<any>(null);
  const [quotaLoading, setQuotaLoading] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testQuotaInfo = async () => {
    setQuotaLoading(true);
    try {
      const quota = await uploadService.getQuotaInfo();
      setQuotaInfo(quota);
      if (quota) {
        addResult(`✅ Quota info loaded: ${quota.daily_limit_gb}GB limit, ${quota.current_usage_gb}GB used`);
      } else {
        addResult(`❌ Quota info failed: No quota data received`);
      }
    } catch (error: any) {
      addResult(`❌ Quota info failed: ${error.message}`);
    } finally {
      setQuotaLoading(false);
    }
  };

  const testFileValidation = () => {
    const smallFile = { size: 1024 * 1024 } as File; // 1MB
    const largeFile = { size: 3 * 1024 * 1024 * 1024 } as File; // 3GB
    
    const smallValidation = uploadService.validateFileSize(smallFile.size);
    const largeValidation = uploadService.validateFileSize(largeFile.size);
    
    addResult(`✅ Small file validation: ${smallValidation.valid ? 'PASS' : 'FAIL'}`);
    addResult(`❌ Large file validation: ${largeValidation.valid ? 'PASS' : 'FAIL'} - ${largeValidation.error}`);
  };

  const testAuthStatus = () => {
    const isAuth = authService.isAuthenticated();
    const user = authService.getCurrentUser();
    addResult(`🔐 Auth status: ${isAuth ? 'Authenticated' : 'Anonymous'}`);
    addResult(`👤 Current user: ${user ? user.email : 'None'}`);
  };

  const testProfileLoading = async () => {
    try {
      addResult(`🔄 Testing profile loading...`);
      const userData = await authService.loadUserProfile();
      addResult(`✅ Profile loaded successfully: ${userData.email}`);
      addResult(`📊 Storage used: ${userData.storage_used_gb}GB`);
      addResult(`📁 Total files: ${userData.total_files}`);
      addResult(`📈 File breakdown: Docs:${userData.file_type_breakdown?.documents || 0}, Images:${userData.file_type_breakdown?.images || 0}, Videos:${userData.file_type_breakdown?.videos || 0}, Other:${userData.file_type_breakdown?.other || 0}`);
    } catch (error: any) {
      addResult(`❌ Profile loading failed: ${error.message}`);
    }
  };

  const testBatchInitiation = async () => {
    try {
      const files = [
        { filename: 'test1.txt', size: 1024, content_type: 'text/plain' },
        { filename: 'test2.pdf', size: 2048, content_type: 'application/pdf' }
      ];
      
      const response = await batchUploadService.initiateBatch(files);
      addResult(`✅ Batch initiation: ${response.batch_id} with ${response.files.length} files`);
    } catch (error: any) {
      addResult(`❌ Batch initiation failed: ${error.message}`);
    }
  };

  const testStorageCleanup = async () => {
    try {
      addResult(`🔄 Testing storage cleanup service (demo mode)...`);
      const result = await storageCleanupService.runStorageCleanupDemo(false);
      addResult(`✅ Storage cleanup demo completed: ${result.mode} mode`);
      addResult(`📊 GDrive files deleted: ${result.gdrive.summary.deleted}`);
      addResult(`❌ GDrive errors: ${result.gdrive.summary.errors}`);
      addResult(`🗃️ DB files marked deleted: ${result.files_marked_deleted}`);
      addResult(`🗑️ DB files hard deleted: ${result.files_hard_deleted}`);
      addResult(`📦 Batches deleted: ${result.batches_deleted}`);
      addResult(`📋 Accounts processed: ${Object.keys(result.gdrive.per_account).length}`);
    } catch (error: any) {
      addResult(`❌ Storage cleanup test failed: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Service Testing Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Test Controls</h2>
          
          <button
            onClick={testQuotaInfo}
            disabled={quotaLoading}
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {quotaLoading ? 'Loading...' : 'Test Quota Info'}
          </button>
          
          <button
            onClick={testFileValidation}
            className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600"
          >
            Test File Validation
          </button>
          
          <button
            onClick={testAuthStatus}
            className="w-full bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600"
          >
            Test Auth Status
          </button>
          
          <button
            onClick={testBatchInitiation}
            className="w-full bg-orange-500 text-white p-3 rounded-lg hover:bg-orange-600"
          >
            Test Batch Initiation
          </button>
          
          <button
            onClick={testProfileLoading}
            className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600"
          >
            Test Profile Loading
          </button>
          
          <button
            onClick={testStorageCleanup}
            className="w-full bg-yellow-500 text-white p-3 rounded-lg hover:bg-yellow-600"
          >
            Test Storage Cleanup
          </button>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Quota Information</h2>
          {quotaInfo ? (
            <div className="bg-gray-100 p-4 rounded-lg">
              <pre className="text-sm overflow-auto">
                {JSON.stringify(quotaInfo, null, 2)}
              </pre>
            </div>
          ) : (
            <p className="text-gray-500">No quota info loaded yet</p>
          )}
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Test Results</h2>
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
          {testResults.length === 0 ? (
            <p>No tests run yet. Click the buttons above to test services.</p>
          ) : (
            testResults.map((result, index) => (
              <div key={index} className="mb-1">{result}</div>
            ))
          )}
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">Environment Variables</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>API Base URL:</strong> {process.env.NEXT_PUBLIC_API_BASE_URL || 'Not set (default: http://localhost:5000)'}
          </div>
          <div>
            <strong>WebSocket URL:</strong> {process.env.NEXT_PUBLIC_WS_URL || 'Not set (default: ws://localhost:5000/ws_api)'}
          </div>
        </div>
      </div>
    </div>
  );
}
