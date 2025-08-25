const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

// Імпортуємо WebSocket логіку
const socketHandler = require('./sockets');

// Імпортуємо API-роути
const routes = require('./routes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // ['http://localhost:3000']
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

const PORT = process.env.PORT || 3001;
const MONGO_URI = 'mongodb://localhost:27017/inventory'

// Підключення до MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Підключено до MongoDB'))
  .catch((err) => console.error('❌ MongoDB помилка:', err));

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// Роути
app.use('/api', routes);

// Ініціалізація WebSocket логіки
socketHandler(io);

// Запуск сервера
server.listen(PORT, () => {
  console.log(`🚀 Сервер працює на http://localhost:${PORT}`);
});
