const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {
  console.log('new WS connected');

  //   Welcome new user
  socket.emit('message', 'Welcome to the ChatCord');

  //   Notify all of new user except the user itself.
  socket.broadcast.emit('message', 'A new user connected');

  //   Notify all
  //   io.emit('message', 'Welcome all');

  socket.on('disconnect', (socket) => {
    console.log('user disconnected');
  });
});

app.use(express.static(path.join(__dirname, 'public')));

const PORT = 80 || process.env.PORT;
server.listen(PORT, () => {
  console.log(`Listening to the port: ${PORT}`);
});
