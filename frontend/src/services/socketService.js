import { io } from 'socket.io-client';

const socket = io('http://localhost:5002');

export const registerCustomer = (orderId) => {
  socket.emit('register_customer', orderId);
};

export const onDriverAccepted = (cb) => {
  socket.on('order_accepted', cb);
};

export const onDriverLocationUpdate = (cb) => {
  socket.on('driver_location_update', cb);
};

export default socket;
