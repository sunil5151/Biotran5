import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import appointmentRouter from './routes/appointmentRoute.js';
import messageRouter from './routes/messageRoute.js';

// Environment variables for deployment
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000';

const app = express();
const port = process.env.PORT || 4000;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [FRONTEND_URL, BACKEND_URL],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// middlewares
app.use(express.json());
app.use(cors({
  origin: [FRONTEND_URL, BACKEND_URL], // Using environment variables
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));


connectDB();

// Routes
app.use('/api/appointment', appointmentRouter);
app.use('/api/user', userRouter); 
app.use('/api/doctor', doctorRouter);
app.use('/api/messages', messageRouter);



app.get('/', (req, res) => {
  res.send('API WORKING');
});

// Socket.io connection
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  // User comes online
  socket.on('user_online', (email) => {
    onlineUsers.set(email, socket.id);
    io.emit('user_status', Array.from(onlineUsers.keys()));
    console.log('User online:', email);
  });
  
  // User starts typing
  socket.on('typing', ({ sender, receiver }) => {
    const receiverSocketId = onlineUsers.get(receiver);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('typing_indicator', { sender, isTyping: true });
    }
  });
  
  // User stops typing
  socket.on('stop_typing', ({ sender, receiver }) => {
    const receiverSocketId = onlineUsers.get(receiver);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('typing_indicator', { sender, isTyping: false });
    }
  });
  
  // New message
  socket.on('send_message', (messageData) => {
    const receiverSocketId = onlineUsers.get(messageData.receiver);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receive_message', messageData);
    }
  });
  
  // User disconnects
  socket.on('disconnect', () => {
    let disconnectedUser = null;
    for (const [user, id] of onlineUsers.entries()) {
      if (id === socket.id) {
        disconnectedUser = user;
        break;
      }
    }
    
    if (disconnectedUser) {
      onlineUsers.delete(disconnectedUser);
      io.emit('user_status', Array.from(onlineUsers.keys()));
      console.log('User offline:', disconnectedUser);
    }
  });
});

httpServer.listen(port, () => console.log("Server Started on port", port));