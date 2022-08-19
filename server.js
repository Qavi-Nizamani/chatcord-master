const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { formatMessage } = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  getRoomUsers,
  userLeaves,
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const botName = 'Chat Cord';
io.on('connection', (socket) => {
  // Get username and room from the client
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    io.to(user.room).emit('roomUsers', {
      room,
      users: getRoomUsers(user.room),
    });

    //   Welcome new user
    socket.emit(
      'message',
      formatMessage(user.username, 'Welcome to the ChatCord')
    );

    //   Notify all of new user except the user itself.
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined the chat`)
      );
  });

  // Get chat message
  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user?.room).emit('message', formatMessage(user?.username, msg));
  });

  //   Notify all
  //   io.emit('message', 'Welcome all');

  socket.on('disconnect', () => {
    const user = userLeaves(socket.id);

    if (user) {
      socket.broadcast
        .to(user.room)
        .emit('message', formatMessage(botName, user.username + ' left'));

      const users = getRoomUsers(user.room);

      socket.broadcast
        .to(user.room)
        .emit('roomUsers', { room: user.room, users });
    }
  });
});

app.use(express.static(path.join(__dirname, 'public')));

const PORT = 80 || process.env.PORT;
server.listen(PORT, () => {
  console.log(`Listening to the port: ${PORT}`);
});
