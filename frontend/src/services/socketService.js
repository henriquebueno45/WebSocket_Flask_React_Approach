import io from 'socket.io-client';

let socket;

export const establishSocketConnection = (onUpdateCallback) => {
  const socketUrl = 'http://localhost:5000';
  const options = {
    transports: ['websocket'],
  };

  socket = io(socketUrl, options);

  socket.on('connect', () => {
    console.log('Successfully connected to socket server');
  });

  socket.on('updateNodeData', (data) => {
    onUpdateCallback(data);
  });
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};

export const emitNodes = (nodes) => {
  if (socket) {
    socket.emit('updateNodes', nodes);
  }
};

export const startSimulation = () => {
  if (socket) {
    socket.emit('startSimulation');
  }
};

export const stopSimulation = () => {
  if (socket) {
    socket.emit('stopSimulation');
  }
};

export const deleteNode = (nodeId) => {
  if (socket) {
    socket.emit('deleteNode', nodeId);
  }
};