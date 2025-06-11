const tabs = new Map();

module.exports = function (io) {
  io.on('connection', (socket) => {
    console.log('🔌 Клієнт підключився:', socket.id);

    socket.on('register-tab', ({ tabId, currentPage }) => {
      console.log('📝 Registering tab:', { tabId, currentPage });
      tabs.set(tabId, { socketId: socket.id, route: currentPage });
      broadcastTabs();
    });

    socket.on('update-tab', ({ tabId, currentPage }) => {
      if (tabs.has(tabId)) {
        tabs.set(tabId, { socketId: socket.id, route: currentPage });
        broadcastTabs();
      }
    });

    // const interval = setInterval(() => {
    //   const luckyNumber = Math.floor(Math.random() * 100) + 1;
    //   socket.emit('luckyNumber', luckyNumber);
    // }, 10000);

    socket.on('remove-tab', ({ tabId }) => {
      if (tabs.has(tabId)) {
        tabs.delete(tabId);
        broadcastTabs();
      }
    });

    socket.on('disconnect', () => {
      for (const [tabId, data] of tabs.entries()) {
        if (data.socketId === socket.id) {
          tabs.delete(tabId);
        }
      }
      broadcastTabs();
      // clearInterval(interval);
    });

    function broadcastTabs() {
      const tabList = Array.from(tabs.entries()).map(([id, data]) => ({
        id,
        route: data.route,
      }));
      io.emit('tabs-update', tabList);
    }
  });
};
