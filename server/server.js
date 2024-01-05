const path = require('path');
const http = require('http');
const express = require('express');

const {generateMessage, generateLocationMessage} = require('./utils/message');

const socketIO = require('socket.io');
const { create } = require('domain');

const publicPath = path.join(__dirname, '/../public/');

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, '/index.html'));
})

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.emit('newMessage', {
      from: "Admin",
      text: "Welcome to chat app",
      createdAt: new Date().getTime()
  })

  socket.broadcast.emit('newMessage', {
      from: "Admin",
      text: "A new user joined",
      createdAt: new Date().getTime()
    })

  //take an event from client
  socket.on('createMessage', (message) => {
    console.log("createMessage", message);
    //when using socket, the event just broadcast to specific the client that created the event
    socket.emit('newMessage', generateMessage(message.from, message.text));

    //when using io, the event will broadcast to all the clients

    // io.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // })

    //when using socket.broadcast.emit, the event will be broadcast to all the clients except the client that created the event
    socket.broadcast.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    })
  });

  socket.on('createLocationMessage', (location) => {
    socket.broadcast.emit('newMessageLocation', generateLocationMessage("Admin", location.lat, location.long))
  });

  socket.on('disconnect', () => {
    console.log('a user was disconnected');
  });
});

server.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
});