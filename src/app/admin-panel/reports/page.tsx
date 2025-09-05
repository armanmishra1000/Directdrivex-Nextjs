"use client";

import { useReports } from "@/hooks/useReports";
import { GenerateReportsTab } from "@/components/admin/reports/GenerateReportsTab";
import { ReportTemplatesTab } from "@/components/admin/reports/ReportTemplatesTab";
import { CustomReportsTab } from "@/components/admin/reports/CustomReportsTab";
import { ScheduledReportsTab } from "@/components/admin/reports/ScheduledReportsTab";
import { BarChart3, FileText, Plus, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ReportsExportPage() {
  const {
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
  } = useReports();

  const tabs = [
    { id: "generate", label: "Generate Reports", icon: BarChart3 },
    { id: "templates", label: "Templates", icon: FileText },
    { id: "custom", label: "Custom Reports", icon: Plus },
    { id: "scheduled", label: "Scheduled", icon: Calendar },
  ];

  const handleExport = (format: 'json' | 'csv') => {
    if (!currentReport) return;
    const data = format === 'json' ? JSON.stringify(currentReport, null, 2) : 'CSV export not implemented yet.';
    const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentReport.report_info.title.replace(/\s/g, '_')}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/10 dark:bg-blue-400/10 text-blue-500 dark:text-blue-400 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reports & Export</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">Generate comprehensive reports and export data.</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation using shadcn/ui Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger key={tab.id} value={tab.id}>
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </TabsTrigger>
            );
          })}
        </TabsList>
        
        <div className="mt-6 min-h-[600px]">
          <TabsContent value="generate">
            <GenerateReportsTab
              formState={reportForm}
              setFormState={setReportForm}
              onGenerate={generateReport}
              currentReport={currentReport}
              onCloseReport={clearCurrentReport}
              onExportReport={handleExport}
              loading={loading}
            />
          </TabsContent>
          <TabsContent value="templates">
            <ReportTemplatesTab templates={templates} onUseTemplate={useTemplate} />
          </TabsContent>
          <TabsContent value="custom">
            <CustomReportsTab
              formState={customReportForm}
              setFormState={setCustomReportForm}
              onGenerate={generateCustomReport}
              onReset={resetCustomReport}
              loading={loading}
            />
          </TabsContent>
          <TabsContent value="scheduled">
            <ScheduledReportsTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}