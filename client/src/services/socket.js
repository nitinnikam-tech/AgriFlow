import { io } from 'socket.io-client';

let socket = null;

export function getSocket() {
  if (!socket) {
    socket = io(window.location.origin, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000
    });

    socket.on('connect', () => {
      console.log('⚡ Connected to AgriFlow Real-Time WebSocket Server');
    });

    socket.on('disconnect', () => {
      console.log('🔌 Disconnected from AgriFlow WebSocket');
    });
  }
  return socket;
}
