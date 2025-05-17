import { io } from 'socket.io-client';

let socket = null;
let socketPromise = null;

const createSocketConnection = (token, userDetails) => {
  return new Promise((resolve, reject) => {
    const newSocket = io('http://localhost:5005', {
      auth: { token },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    newSocket.on('connect', () => {
      console.log('Connected to socket server');
      newSocket.emit('user_connected', {
        userId: userDetails.userId,
        userType: userDetails.currentRole,
      });
      resolve(newSocket);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      reject(error);
    });
  });
};

export const initSocket = async (token, userDetails) => {
  if (socket) return socket;
  
  try {
    socketPromise = createSocketConnection(token, userDetails);
    socket = await socketPromise;
    return socket;
  } catch (error) {
    console.error('Socket initialization failed:', error);
    throw error;
  }
};

const ensureSocket = async () => {
  if (socket) return socket;
  if (socketPromise) return await socketPromise;
  throw new Error('Socket not initialized. Call initSocket() first.');
};

export const joinOrderTracking = async (orderId) => {
  const currentSocket = await ensureSocket();
  currentSocket.emit('join_order', orderId);
};

export const onOrderStatusUpdate = async (callback) => {
  const currentSocket = await ensureSocket();
  currentSocket.on('order_status_update', callback);
  return () => currentSocket.off('order_status_update', callback);
};

export const onDriverAssigned = async (callback) => {
  const currentSocket = await ensureSocket();
  currentSocket.on('driver_assigned', callback);
  return () => currentSocket.off('driver_assigned', callback);
};

export const onDriverLocationUpdate = async (callback) => {
  const currentSocket = await ensureSocket();
  currentSocket.on('driver_location_update', callback);
  return () => currentSocket.off('driver_location_update', callback);
};

export const requestDriver = async (orderData) => {
  const currentSocket = await ensureSocket();
  currentSocket.emit('request_driver', orderData);
};

export const disconnectSocket = () => {
  if (!socket) return;
  socket.removeAllListeners();
  socket.disconnect();
  socket = null;
  socketPromise = null;
};

// Default export with all functions
export default {
  initSocket,
  joinOrderTracking,
  onOrderStatusUpdate,
  onDriverAssigned,
  onDriverLocationUpdate,
  requestDriver,
  disconnectSocket,
  getSocket: () => socket
};