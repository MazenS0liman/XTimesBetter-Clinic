const express = require('express');
const mongoose = require('mongoose');
const socketIO = require('socket.io');
const dotenv = require('dotenv').config();
const cors = require('cors');
const http = require('http');
import { createServer } from "http"
import { Server } from "socket.io"

const httpServer = createServer()


mongoose.set('strictQuery', false);

// Express app
const app = express();
const io = socketIO(server);

// App variables
const Port = process.env.PORT || 5000;
const MongoURI = process.env.MONGO_URI;

const corsOptions = {
  origin: '*',
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200,
}

// Increase payload size limit (e.g., 50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(cors(corsOptions))

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static(__dirname + '/uploads'));


// Middleware for allowing react to fetch() from server
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, OPTIONS');
  next();
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    socket.emit('connection', null);
    
    // Listen for incoming chat messages
    socket.on('chat message', (data) => {
      console.log('Received message:', data);
  
      // Save the message to MongoDB
      const message = new Message({ user: data.user, text: data.message });
      message.save((err) => {
        if (err) {
          console.error('Error saving message to database:', err);
        } else {
          console.log('Message saved to the database');
        }
      });
  
      // Broadcast the message to all connected clients
      io.emit('chat message', data);
    });
  
    // Listen for user disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });