const express = require('express');
const app = require('./app');
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const activeUsers = {};
io.on('connection', (socket) => {
  socket.on('send_to_server', (message) => {
    const { messageText, friendName, myName } = message;

    if (activeUsers[friendName])
      io.to(activeUsers[friendName]).emit('send_to_client', messageText);
    io.emit('render_msg', friendName);
  });
  socket.on('addUser', (name) => {
    activeUsers[name] = socket.id;
  });

  socket.on('disconnect', () => {
    const myName = Object.keys(activeUsers).filter(
      (id) => activeUsers[id] === socket.id
    );
    delete activeUsers[myName[0]];
  });
});

module.exports = server;
