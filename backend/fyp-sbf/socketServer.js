// socketServer.js
const { createServer } = require('http');
const { Server } = require('socket.io');

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('🟢 Socket connected:', socket.id);

  // Join user-specific room
  socket.on('join', (userId) => {
    if (userId) {
      socket.join(`user-${userId}`);
      console.log(`📥 User ${userId} joined room user-${userId}`);
    }
  });

  // Handle message sending
  socket.on('sendMessage', (msg) => {
    if (!msg?.receiverId || !msg?.senderId || !msg?.content) return;

    // Emit message to receiver
    io.to(`user-${msg.receiverId}`).emit(`message-${msg.receiverId}`, msg);

    // Optionally emit back to sender (for instant feedback)
    socket.emit(`message-${msg.senderId}`, msg);
  });

  // Handle friend request response
  socket.on('friendRequestResponse', ({ to, chatId, status, fromUsername }) => {
    if (!to || !chatId || !status) return;

    io.to(`user-${to}`).emit(`friendRequestResponse-${to}`, {
      chatId,
      status,
      fromUsername,
    });
  });

  // Notify of new friend request
  socket.on('newFriendRequest', ({ to, from }) => {
    if (!to || !from) return;

    console.log(`📨 Friend request sent from ${from} to ${to}`);
    io.to(`user-${to}`).emit(`newFriendRequest-${to}`, { from });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('🔴 Socket disconnected:', socket.id);
  });
});

httpServer.listen(4000, () => {
  console.log('🟢 Socket.IO server running on port 4000');
});
