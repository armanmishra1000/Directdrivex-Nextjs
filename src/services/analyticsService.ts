// Analytics service for tracking user interactions and upload events
export class AnalyticsService {
  // Track file selection events
  static trackFileSelected(properties: {
    file_type: string;
    file_size: number;
    upload_type: 'single' | 'batch';
    file_count?: number;
  }) {
    this.trackEvent('file_selected', properties);
  }

  // Track upload initiation
  static trackUploadStarted(properties: {
    file_name: string;
    file_size: number;
    file_type: string;
    upload_type: 'single' | 'batch';
  }) {
    this.trackEvent('upload_started', properties);
  }

  // Track upload completion
  static trackUploadCompleted(properties: {
    file_name: string;
    file_size: number;
    file_type: string;
    file_id: string;
    upload_type: 'single' | 'batch';
  }) {
    this.trackEvent('upload_completed', properties);
  }

  // Track upload failures
  static trackUploadFailed(properties: {
    file_name: string;
    file_size: number;
    file_type: string;
    error_message: string;
    progress_at_failure: number;
    upload_type: 'single' | 'batch';
  }) {
    this.trackEvent('upload_failed', properties);
  }

  // Track upload cancellations
  static trackUploadCancelled(properties: {
    file_name?: string;
    progress_at_cancellation: number;
    upload_type: 'single' | 'batch';
  }) {
    this.trackEvent('upload_cancelled', properties);
  }

  // Track CTA button clicks
  static trackCTAButtonClicked(properties: {
    button_type: string;
    location: string;
  }) {
    this.trackEvent('cta_button_clicked', properties);
  }

  // Track homepage views
  static trackHomepageViewed() {
    this.trackEvent('homepage_viewed');
  }

  // Generic event tracking method
  private static trackEvent(event: string, properties?: any) {
    // Hotjar tracking (if available)
    if (typeof window !== 'undefined' && (window as any).hj) {
      (window as any).hj('event', event, properties);
    }
    
    // Vercel Analytics (if available)
    if (typeof window !== 'undefined' && (window as any).va) {
      (window as any).va.track(event, properties);
    }
    
    // Google Analytics 4 (if available)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event, properties);
    }
    
    // Console logging for development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[ANALYTICS] Event: ${event}`, properties);
    }
  }

  // Track quota information
  static trackQuotaInfo(properties: {
    user_type: 'anonymous' | 'authenticated';
    daily_limit_gb: number;
    current_usage_gb: number;
    remaining_gb: number;
    usage_percentage: number;
  }) {
    this.trackEvent('quota_info', properties);
  }

  // Track file validation failures
  static trackFileValidationFailed(properties: {
    file_name: string;
    file_size: number;
    validation_type: 'size_limit' | 'file_count' | 'file_type';
    user_type: 'anonymous' | 'authenticated';
  }) {
    this.trackEvent('file_validation_failed', properties);
  }

  // Track user authentication state changes
  static trackAuthStateChange(properties: {
    previous_state: 'anonymous' | 'authenticated';
    new_state: 'anonymous' | 'authenticated';
    trigger: 'login' | 'logout' | 'token_expiry' | 'page_load';
  }) {
    this.trackEvent('auth_state_change', properties);
  }

  // Track WebSocket connection events
  static trackWebSocketEvent(properties: {
    event_type: 'connected' | 'disconnected' | 'error' | 'timeout';
    connection_time_ms?: number;
    error_message?: string;
  }) {
    this.trackEvent('websocket_event', properties);
  }

  // Track performance metrics
  static trackPerformance(properties: {
    metric_name: string;
    value: number;
    unit: string;
    context?: string;
  }) {
    this.trackEvent('performance_metric', properties);
  }
}
