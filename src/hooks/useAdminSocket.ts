"use client";

import { useState, useEffect, useCallback } from 'react';
import { adminSocketService } from '@/services/adminSocketService';
import { useAdminAuth } from './useAdminAuth';
import { AdminNotification } from '@/types/admin';

export const useAdminSocket = () => {
  const [events, setEvents] = useState<string[]>([
    'Admin WebSocket connection initializing...',
    'System monitoring starting...',
    'Dashboard loaded successfully'
  ]);
  const [isConnected, setIsConnected] = useState(false);
  const { adminUser } = useAdminAuth();
  
  const addEvent = useCallback((event: string) => {
    setEvents(prev => {
      const newEvents = [event, ...prev];
      // Keep only the last 100 events for performance
      return newEvents.slice(0, 100);
    });
  }, []);
  
  const clearEvents = useCallback(() => {
    setEvents(['Event log cleared']);
  }, []);
  
  // Add multiple events with timestamps
  const addBulkEvents = useCallback((newEvents: string[]) => {
    setEvents(prev => {
      const combinedEvents = [...newEvents, ...prev];
      return combinedEvents.slice(0, 100);
    });
  }, []);
  
  // Parse notification from event data
  const parseNotification = useCallback((eventData: string): AdminNotification | null => {
    try {
      // Check if event looks like a notification (basic heuristic)
      if (eventData.includes('NOTIFICATION:')) {
        const cleanData = eventData.replace('NOTIFICATION:', '').trim();
        const data = JSON.parse(cleanData);
        
        // Validate expected notification format
        if (data.title && data.message && data.type) {
          return {
            id: `socket-${Date.now()}`,
            title: data.title,
            message: data.message,
            type: data.type as 'info' | 'warning' | 'error' | 'success',
            timestamp: new Date()
          };
        }
      }
      return null;
    } catch (error) {
      console.warn('Failed to parse notification from event:', error);
      return null;
    }
  }, []);
  
  useEffect(() => {
    if (!adminUser) return;
    
    const token = localStorage.getItem('admin_access_token');
    if (!token) return;
    
    // Connect to WebSocket
    adminSocketService.connect(token);
    addEvent('WebSocket connection attempt initiated');
    
    // Set up event handlers
    const removeEventHandler = adminSocketService.onEvent(event => {
      addEvent(event);
    });
    
    const removeConnectionHandler = adminSocketService.onConnectionChange(connected => {
      setIsConnected(connected);
      addEvent(connected 
        ? 'WebSocket connected successfully' 
        : 'WebSocket disconnected'
      );
    });
    
    // Clean up on unmount
    return () => {
      removeEventHandler();
      removeConnectionHandler();
      adminSocketService.disconnect();
      addEvent('WebSocket connection closed');
    };
  }, [adminUser, addEvent]);
  
  // Simulated events for development preview
  useEffect(() => {
    if (!isConnected) return;
    
    // Demo events that happen periodically
    const demoEvents = [
      'User login detected: admin@enterprise.com',
      'Backup process started',
      'Storage optimization completed',
      'New file uploaded: financial-report-q2.xlsx',
      'System health check: All systems operational',
      'Google Drive quota usage increased by 2%',
      'Scheduled maintenance completed'
    ];
    
    const interval = setInterval(() => {
      // Only add random events if connected
      if (isConnected && Math.random() > 0.7) {
        const randomEvent = demoEvents[Math.floor(Math.random() * demoEvents.length)];
        addEvent(randomEvent);
      }
    }, 8000);
    
    return () => clearInterval(interval);
  }, [isConnected, addEvent]);
  
  return {
    events,
    isConnected,
    clearEvents,
    addEvent,
    addBulkEvents,
    parseNotification
  };
};
