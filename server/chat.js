const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const cors = require('cors');
const Server = require('socket.io').Server;

const ChatPort = process.env.CHAT_PORT || 4000;
const MongoURI = process.env.MONGO_URI;

const app = express();

// Connect to MongoDB
mongoose.connect(MongoURI)
  .then(() => {
    console.log("Chat Server: MongoDB is now connected!")

    const allowedOrigins = ['http://localhost:5173'];

    // Set up CORS options.
    const corsOptions = {
      origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
    };

    // Enable CORS for all routes or specify it for specific routes.
    app.use(cors(corsOptions));

    // Starting server
    const expressServer = app.listen(ChatPort, () => {
      console.log(`Chat Server: Listening to requests on http://localhost:${ChatPort}`);
    });

/*     const socketIO = new Server(expressServer, {
        cors: {
            origin: '*',
            credentials: true,            //access-control-allow-credentials:true
            optionSuccessStatus: 200,
        }
    });

    socketIO.on('connection', (socket) => {
        console.log(`⚡: ${socket.id} user just connected!`);

        //sends the message to all the users on the server
        socket.on('message', (data) => {
            console.log(data);
            socketIO.emit('messageResponse', data);
        });

        socket.on('disconnect', () => {
        console.log('🔥: A user disconnected');
        });
    }); */

  })
  .catch(err => console.log(err));




