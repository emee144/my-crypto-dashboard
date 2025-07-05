import { Server } from 'socket.io';

export async function GET(req) {
  if (!req.socket.server.io) {
    const io = new Server(req.socket.server);
    req.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('User connected');
      
      socket.on('send_message', (data) => {
        io.emit('new_message', data);  // Broadcast the new message to all clients
      });
    });
  }
  return new Response(null);
}
