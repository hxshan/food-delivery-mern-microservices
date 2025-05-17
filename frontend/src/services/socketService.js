// services/socketService.js
import { io } from 'socket.io-client';
import { API_URL } from '../api';

class SocketService {
  constructor() {
    this.socket = null;
    this.eventListeners = new Map();
  }

  connect() {
    if (this.socket?.connected) return;

    const user = localStorage.getItem('user');
    const token = user?.token
    if (!token) {
      console.error('No access token available for socket connection');
      return;
    }

    this.socket = io(`${API_URL}/api/delivery`, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true,
      transports: ['websocket'],
    });

    this.setupConnectionEvents();
  }

  disconnect() {
    if (this.socket) {
      // Remove all listeners
      this.eventListeners.forEach((callback, event) => {
        this.socket.off(event, callback);
      });
      this.eventListeners.clear();
      
      this.socket.disconnect();
      this.socket = null;
    }
  }
  getSocket() {
    return this.socket;
  }
  setupConnectionEvents() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      if (reason === 'io server disconnect') {
        this.socket.connect();
      }
    });

    this.socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
      if (err.message === 'Invalid token') {
        // Handle token refresh or redirect to login
      }
    });
  }

  // Add event listener
  on(event, callback) {
    if (!this.socket) {
      console.error('Socket not initialized');
      return;
    }
    if (this.eventListeners.has(event)) return;
    
    this.eventListeners.set(event, callback);
    this.socket.on(event, callback);
  }

  // Remove event listener
  off(event) {
    if (!this.socket) return;

    const callback = this.eventListeners.get(event);
    if (callback) {
      this.socket.off(event, callback);
      this.eventListeners.delete(event);
    }
  }

  // Emit an event
  emit(event, data, callback) {
    if (!this.socket) {
      console.error('Socket not initialized');
      return;
    }

    this.socket.emit(event, data, callback);
  }

  // Check connection status
  isConnected() {
    return this.socket?.connected || false;
  }
}

const socketService = new SocketService();
export default socketService;