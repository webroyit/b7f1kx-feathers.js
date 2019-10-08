// Setup Socket.io
const socket = io('http://localhost:3000');

// Initize feathers app
const app = feathers();

// Allow socket.io to communicate to the server
app.configure(feathers.socket.io(socket));