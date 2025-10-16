const tabs = new Map();

module.exports = function(io, socket) {
  socket.on('register-tab', ({ tabId, currentPage }) => {
    tabs.set(tabId, { socketId: socket.id, route: currentPage });
    broadcastTabs(io);
  });

  socket.on('update-tab', ({ tabId, currentPage }) => {
    if (tabs.has(tabId)) {
      tabs.set(tabId, { socketId: socket.id, route: currentPage });
      broadcastTabs(io);
    }
  });

  socket.on('remove-tab', ({ tabId }) => {
    if (tabs.has(tabId)) {
      tabs.delete(tabId);
      broadcastTabs(io);
    }
  });

  socket.on('disconnect', () => {
    for (const [tabId, data] of tabs.entries()) {
      if (data.socketId === socket.id) tabs.delete(tabId);
    }
    broadcastTabs(io);
  });
};

function broadcastTabs(io) {
  const tabList = Array.from(tabs.entries()).map(([id, data]) => ({
    id,
    route: data.route,
  }));
  io.emit('tabs-update', tabList);
}