'strict';
import socket from 'socket.io';
import { server } from '../index';
import * as helper from '../helpers';
import adminNamespace from './admin-namespace';
// import {adminNamespace} from "./admin-namespace";

// Socket setup
const io = socket(server, {
  cors: {
    'Access-Control-Allow-Origin': '*',
    origin: '*',
  },
});

export let ipsconnected = [];

export const addingNewUser = (userId, socketId) => {
  !ipsconnected.some((user) => user.userId === userId) &&
    ipsconnected.push({
      userId,
      socketId,
    });
};

const removeUser = (socketId) => {
  ipsconnected = ipsconnected.filter((user) => user.socketId !== socketId);
};

export const getUser = (userId) => {
  return ipsconnected.find((user) => user.userId === userId);
};

const admin = adminNamespace(io);

io.on('connection', (socket) => {
  // console.log('connection', socket);
  // Join a room
  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
  });
  socket.on('message', (message) => {
    socket.join(message);
    socket.emit('message', "Received: Thanks");
    console.log(`User ${socket.id} joined room: ${message}`);
  });
  
  // use event to add new user
  // socket.on('addingNewUser', (userId)=>{
  //   addingNewUser(userId, socket.id)
  //   console.log('socket connected', userId, socket.id)
  // })

  // socket.on('disconnect', ()=>{
  //   removeUser(socket.id)
  // })

  // socket.on('logoutUser', (userId)=>{
  //   const user = getUser(userId)
  //   removeUser(user.socket.id)
  // })

  // socket.on("disconnect", () => {
  //     console.log('socket disconnected')
  // });
});

export default io;
