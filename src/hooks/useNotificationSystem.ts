"use client";

import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '@/services/admin/notificationService';
import { Notification, NotificationStats, NotificationTemplate, NotificationFilters, UserGroupPreview, NotificationPriority, NotificationType, TargetType } from '@/types/notifications';
import { toast } from "sonner";

export function useNotificationSystem() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [filters, setFilters] = useState<NotificationFilters>({ status: '', type: '', priority: '' });
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [createNotificationForm, setCreateNotificationForm] = useState({
    title: '', message: '', notification_type: 'in_app' as NotificationType, priority: 'medium' as NotificationPriority, target_type: 'all_users' as TargetType, target_users: '', email_subject: '', schedule_time: ''
  });

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsData, notificationsData, templatesData] = await Promise.all([
        notificationService.getDashboardStats(),
        notificationService.getNotifications(filters, pagination.page, pagination.limit),
        notificationService.getTemplates(),
      ]);
      setStats(statsData);
      setNotifications(notificationsData.notifications);
      setPagination(prev => ({ ...prev, total: notificationsData.total }));
      setTemplates(templatesData);
    } catch (error) {
      toast.error("Failed to load notification data.");
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const createNotification = async (data: any) => {
    await notificationService.createNotification(data);
    toast.success("Notification created successfully!");
    refreshData();
    setActiveTab('notifications');
  };

  const createTemplate = async (data: any) => {
    await notificationService.createTemplate(data);
    toast.success("Template created successfully!");
    refreshData();
  };

  const deleteNotification = async (id: string) => {
    await notificationService.deleteNotification(id);
    toast.success("Notification deleted.");
    refreshData();
  };

  const sendNotificationNow = async (id: string) => {
    await notificationService.sendNotificationNow(id);
    toast.success("Notification sent!");
    refreshData();
  };

  const useTemplate = (template: NotificationTemplate) => {
    setCreateNotificationForm({
      title: template.name,
      message: template.content,
      notification_type: template.notification_type,
      priority: template.priority,
      email_subject: template.subject || '',
      target_type: 'all_users',
      target_users: '',
      schedule_time: '',
    });
    setActiveTab('create');
  };

  const previewUserGroup = async (targetType: TargetType) => {
    return await notificationService.previewUserGroup(targetType);
  };

  return {
    loading,
    stats,
    notifications,
    templates,
    filters,
    pagination,
    activeTab,
    createNotificationForm,
    setCreateNotificationForm,
    setActiveTab,
    setFilters: (newFilters: NotificationFilters) => {
      setFilters(newFilters);
      setPagination(p => ({ ...p, page: 1 }));
    },
    setPage: (page: number) => setPagination(p => ({ ...p, page })),
    refreshData,
    createNotification,
    createTemplate,
    deleteNotification,
    sendNotificationNow,
    useTemplate,
    previewUserGroup,
  };
}