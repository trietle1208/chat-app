const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '/../public');

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);


app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, '/index.html'));
})

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('a user was disconnected');
  })
});

server.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
});