type EventHandler = (event: string) => void;
type ConnectionHandler = (connected: boolean) => void;

class AdminSocketService {
  private socket: WebSocket | null = null;
  private eventHandlers: EventHandler[] = [];
  private connectionHandlers: ConnectionHandler[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  
  connect(token: string): void {
    if (typeof window === 'undefined') return;
    if (this.socket?.readyState === WebSocket.OPEN) return;
    
    try {
      this.socket = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000'}/ws_admin?token=${token}`);
      
      this.socket.onopen = () => {
        console.log('Admin WebSocket connected');
        this.reconnectAttempts = 0;
        this.notifyConnectionHandlers(true);
      };
      
      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.message) {
            this.notifyEventHandlers(data.message);
          }
        } catch (err) {
          console.warn('Failed to parse WebSocket message:', err);
        }
      };
      
      this.socket.onclose = () => {
        console.log('Admin WebSocket disconnected');
        this.notifyConnectionHandlers(false);
        this.attemptReconnect(token);
      };
      
      this.socket.onerror = (error) => {
        console.error('Admin WebSocket error:', error);
        this.notifyConnectionHandlers(false);
      };
      
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      this.notifyConnectionHandlers(false);
    }
  }
  
  disconnect(): void {
    this.reconnectAttempts = this.maxReconnectAttempts;
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.notifyConnectionHandlers(false);
  }
  
  private attemptReconnect(token: string): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) return;
    
    this.reconnectAttempts++;
    this.reconnectTimeout = setTimeout(() => {
      console.log(`Attempting WebSocket reconnect ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      this.connect(token);
    }, 2000 * this.reconnectAttempts);
  }
  
  onEvent(handler: EventHandler): () => void {
    this.eventHandlers.push(handler);
    return () => {
      const index = this.eventHandlers.indexOf(handler);
      if (index > -1) this.eventHandlers.splice(index, 1);
    };
  }
  
  onConnectionChange(handler: ConnectionHandler): () => void {
    this.connectionHandlers.push(handler);
    handler(this.isConnected()); // Immediately notify with current state
    return () => {
      const index = this.connectionHandlers.indexOf(handler);
      if (index > -1) this.connectionHandlers.splice(index, 1);
    };
  }
  
  private notifyEventHandlers(event: string): void {
    this.eventHandlers.forEach(handler => handler(event));
  }
  
  private notifyConnectionHandlers(connected: boolean): void {
    this.connectionHandlers.forEach(handler => handler(connected));
  }
  
  isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }
  
  sendMessage(message: string): void {
    if (this.isConnected()) {
      this.socket?.send(JSON.stringify({ message }));
    } else {
      console.warn('Cannot send message: WebSocket not connected');
    }
  }
}

export const adminSocketService = new AdminSocketService();
