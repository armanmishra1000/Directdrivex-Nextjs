"use client";

import { useState, useCallback } from 'react';
import {
  ReportTemplate,
  ReportFormState,
  CustomReportFormState,
  GeneratedReport,
  UseReportsReturn,
} from '@/types/reports';
import { reportsService } from '@/services/admin/reportsService';
import { toastService } from '@/services/toastService';

const getDefaultDates = () => {
  const today = new Date();
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  return {
    to: today.toISOString().split('T')[0],
    from: lastWeek.toISOString().split('T')[0],
  };
};

export function useReports(): UseReportsReturn {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('generate');
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [currentReport, setCurrentReport] = useState<GeneratedReport | null>(null);

  const [reportForm, setReportFormState] = useState<ReportFormState>({
    report_type: 'system_overview',
    export_format: 'json',
    date_from: getDefaultDates().from,
    date_to: getDefaultDates().to,
    include_inactive: false,
    group_by: 'user',
  });

  const [customReportForm, setCustomReportFormState] = useState<CustomReportFormState>({
    title: '',
    description: '',
    export_format: 'json',
    date_from: getDefaultDates().from,
    date_to: getDefaultDates().to,
    data_sources: [],
    fields: [],
  });

  const setReportForm = (form: Partial<ReportFormState>) => setReportFormState(prev => ({ ...prev, ...form }));
  const setCustomReportForm = (form: Partial<CustomReportFormState>) => setCustomReportFormState(prev => ({ ...prev, ...form }));

  const loadTemplates = useCallback(async () => {
    try {
      const data = await reportsService.getReportTemplates();
      setTemplates(data);
    } catch (error) {
      toastService.error('Failed to load report templates');
    }
  }, []);

  const generateReport = useCallback(async () => {
    setLoading(true);
    setCurrentReport(null);
    try {
      const report = await reportsService.generateReport(reportForm);
      setCurrentReport(report);
      toastService.success('Report generated successfully!');
    } catch (error) {
      toastService.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  }, [reportForm]);

  const generateCustomReport = useCallback(async () => {
    setLoading(true);
    setCurrentReport(null);
    try {
      const report = await reportsService.generateCustomReport(customReportForm);
      setCurrentReport(report);
      toastService.success('Custom report generated successfully!');
      setActiveTab('generate'); // Switch to view the report
    } catch (error) {
      toastService.error('Failed to generate custom report');
    } finally {
      setLoading(false);
    }
  }, [customReportForm]);

  const clearCurrentReport = () => setCurrentReport(null);

  const useTemplate = (template: ReportTemplate) => {
    const today = new Date();
    const fromDate = new Date(today.getTime() - template.default_period_days * 24 * 60 * 60 * 1000);
    setReportForm({
      report_type: template.type,
      export_format: 'json',
      date_from: fromDate.toISOString().split('T')[0],
      date_to: today.toISOString().split('T')[0],
    });
    setActiveTab('generate');
    toastService.info(`Template "${template.name}" applied.`);
  };

  const resetCustomReport = () => {
    setCustomReportFormState({
      title: '',
      description: '',
      export_format: 'json',
      date_from: getDefaultDates().from,
      date_to: getDefaultDates().to,
      data_sources: [],
      fields: [],
    });
  };

  useState(() => {
    loadTemplates();
  });

  return {
    loading,
    activeTab,
    setActiveTab,
    reportForm,
    setReportForm,
    customReportForm,
    setCustomReportForm,
    templates,
    currentReport,
    generateReport,
    generateCustomReport,
    clearCurrentReport,
    useTemplate,
    resetCustomReport,
  };
}