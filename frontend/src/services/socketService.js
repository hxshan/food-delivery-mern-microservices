import { io } from 'socket.io-client';

// Create socket connection with auth token from localStorage or your auth state
const createSocketConnection = (token,userDetails) => {
  // Connect with authentication token in handshake
  const socket = io('http://localhost:5005', {
    auth: {
      token 
    },
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
  });

  // Connection event handlers
  socket.on('connect', () => {
    console.log('Connected to socket server');

    socket.emit('user_connected', {
      userId: userDetails.userId,
      userType: userDetails.currentRole,
    });
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error.message);
  });

  socket.on('disconnect', (reason) => {
    console.log('Disconnected from socket server:', reason);
  });

  return socket;
};

// Initialize socket with user's auth token
let socket = null;

// Function to initialize socket with auth token
export const initSocket = (token,userDetails) => {
  if (socket) {
    socket.disconnect();
  }
  if(!token) return;
    socket = createSocketConnection(token, userDetails);
    return socket;
};

// Customer specific functions
export const joinOrderTracking = (orderId) => {
  if (!socket) return console.error('Socket not initialized');
  socket.emit('join_order', orderId);
};

export const onDriverAccepted = (callback) => {
  if (!socket) return console.error('Socket not initialized');
  socket.on('order_accepted', callback);
};

export const onDriverLocationUpdate = (callback) => {
  if (!socket) return console.error('Socket not initialized');
  socket.on('driver_location_update', callback);
};

export const onDeliveryCompleted = (callback) => {
  if (!socket) return console.error('Socket not initialized');
  socket.on('delivery_done', callback);
};

// Driver specific functions
export const updateDriverLocation = (orderId, location) => {
  if (!socket) return console.error('Socket not initialized');
  socket.emit('update_location', { orderId, location });
};

export const markDeliveryCompleted = (orderId) => {
  if (!socket) return console.error('Socket not initialized');
  socket.emit('delivery_completed', { orderId });
};

// Clean up function to remove listeners and disconnect
export const disconnectSocket = () => {
  if (!socket) return;
  
  // Remove all listeners
  socket.removeAllListeners();
  socket.disconnect();
  socket = null;
  console.log('Socket disconnected and cleaned up');
};

export default {
  initSocket,
  joinOrderTracking,
  onDriverAccepted,
  onDriverLocationUpdate,
  onDeliveryCompleted,
  updateDriverLocation,
  markDeliveryCompleted,
  disconnectSocket,
  getSocket: () => socket
};
