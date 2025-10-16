const chatHandlers = require('./chatHandlers');
const userHandlers = require('./userHandlers');
const tabHandlers = require('./tabHandlers');

module.exports = function(io) {
  io.on('connection', (socket) => {
    console.log('🔌 New client connected', socket.id);

    chatHandlers(io, socket);
    userHandlers(io, socket);
    tabHandlers(io, socket);

    socket.on('disconnect', () => {
      console.log('❌ Disconnected:', socket.id);
    });
  });
};