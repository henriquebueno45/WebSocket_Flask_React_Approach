import io from 'socket.io-client';

let socket;

export const connectToSocket = (onUpdateCallback) => {
  console.log('Attempting to connect to socket');
  socket = io('http://localhost:5000');

  socket.on('connect', () => {
    console.log('Connected to server');
  });

  socket.on('updateSensorData', (msg) => {
    console.log("Raw data received in socketService:", msg);
    console.log("Type of received data:", typeof msg);
    console.log("Temperature type:", typeof msg.temperature);
    console.log("Humidity type:", typeof msg.humidity);
    onUpdateCallback(msg);
  });

  socket.on('connect_error', (error) => {
    console.log('Connection Error:', error);
  });
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};