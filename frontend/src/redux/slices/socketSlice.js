// features/socket/socketSlice.js
import { createSlice } from '@reduxjs/toolkit';
import socketService from '../../services/socketService';

const initialState = {
  connected: false,
  socketId: null,
  lastDisconnectionReason: null,
  orderUpdates: {},
  driverLocations: {},
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    socketConnected: (state, action) => {
      state.connected = true;
      state.socketId = action.payload;
    },
    socketDisconnected: (state, action) => {
      state.connected = false;
      state.lastDisconnectionReason = action.payload;
    },
    newOrderUpdate: (state, action) => {
      const { orderId, ...update } = action.payload;
      state.orderUpdates[orderId] = update;
    },
    driverLocationUpdate: (state, action) => {
      const { orderId, ...location } = action.payload;
      state.driverLocations[orderId] = location;
    },
    clearOrderUpdates: (state) => {
      state.orderUpdates = {};
    },
  },
});

// Action creators for socket emissions
export const emitGetOrderStatus = (orderId) => {
  socketService.emit('customer:get-order-status', orderId);
  return { type: 'socket/emitGetOrderStatus' }; // Dummy action
};

export const emitAcceptOrder = (orderData) => {
  socketService.emit('driver:accept-order', orderData);
  return { type: 'socket/emitAcceptOrder' }; // Dummy action
};

export const emitLocationUpdate = (location) => {
  socketService.emit('driver:location-update', location);
  return { type: 'socket/emitLocationUpdate' }; // Dummy action
};

export const emitOrderReady = (orderData) => {
  socketService.emit('restaurant:order-ready', orderData);
  return { type: 'socket/emitOrderReady' }; // Dummy action
};

export const {
  socketConnected,
  socketDisconnected,
  newOrderUpdate,
  driverLocationUpdate,
  clearOrderUpdates,
} = socketSlice.actions;

export default socketSlice.reducer;