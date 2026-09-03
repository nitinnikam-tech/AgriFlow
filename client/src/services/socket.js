import { io } from 'socket.io-client';

let socket = null;

export function getSocket() {
  if (!socket) {
    const token = localStorage.getItem('agriflow_jwt');
    socket = io(window.location.origin, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      auth: { token }
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

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
  }
}

export function reconnectSocket(newToken) {
  if (socket) {
    socket.auth = { token: newToken };
    socket.disconnect().connect();
  }
}
