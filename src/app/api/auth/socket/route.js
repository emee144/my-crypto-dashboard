import { Server } from 'socket.io';

export async function GET(req) {
  if (!req.socket.server.io) {
    const io = new Server(req.socket.server);
    req.socket.server.io = io;

    // When a client connects, set up event listeners
    io.on('connection', (socket) => {
      console.log('A user connected');

      // Listen for incoming messages
      socket.on('send_message', (data) => {
        console.log('Message received:', data);
        io.emit('new_message', data); // Broadcast to all clients
      });

      // Optional: Listen for typing indicator event
      socket.on('user_typing', (data) => {
        socket.broadcast.emit('typing', data);  // Broadcast to all except sender
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('A user disconnected');
      });
    });
  }

  return new Response(null);  // Just need to initialize the socket server
}
