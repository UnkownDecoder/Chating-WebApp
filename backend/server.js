const express = require('express');
const mongoose = require('mongoose');
const gridfs = require('gridfs-stream');
const multer = require('multer');
const dotenv = require('dotenv');
const authRoutes = require('./routers/authRoutes');
const forgetPas = require('./routers/forgetPassword');
const reviewRouter = require('./routers/reviewRouter');
const userInfo = require('./routers/authUser');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io'); // Import socket.io

dotenv.config(); // Load environment variables from .env file

const app = express();
const server = http.createServer(app); // Create an HTTP server
const io = socketIo(server, { cors: { origin: "http://localhost:5173", credentials: true } }); // Set up socket.io with CORS

const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
  credentials: true
};
app.use(cors(corsOptions));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(bodyParser.json());
app.use(express.json());

// GridFS setup
const conn = mongoose.connection;
let gfs;
conn.once('open', () => {
  gfs = gridfs(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Image Upload Route
app.post('/upload', upload.fields([{ name: 'bannerImage' }, { name: 'profileImage' }]), (req, res) => {
  // Log the files received
  console.log('Uploaded Files:', req.files); // Check if files are received properly

  const files = req.files;
  const bannerImage = files && files.bannerImage ? files.bannerImage[0] : null;
  const profileImage = files && files.profileImage ? files.profileImage[0] : null;

  // Log if bannerImage or profileImage is null
  console.log('Banner Image:', bannerImage);
  console.log('Profile Image:', profileImage);

  const uploadImage = (file) => {
    return new Promise((resolve, reject) => {
      const writeStream = gfs.createWriteStream({
        filename: file.originalname,
        content_type: file.mimetype
      });
      writeStream.write(file.buffer);
      writeStream.end();

      // Log when the file upload finishes
      writeStream.on('finish', () => {
        console.log('File uploaded successfully with ID:', writeStream.id); // Log the uploaded file ID
        resolve(writeStream.id);
      });

      // Log error if any
      writeStream.on('error', (err) => {
        console.error('Error in uploading file:', err); // Log any errors in the upload process
        reject(err);
      });
    });
  };

  // Start uploading both banner and profile images if available
  Promise.all([
    bannerImage ? uploadImage(bannerImage) : null,
    profileImage ? uploadImage(profileImage) : null
  ])
    .then(([bannerImageId, profileImageId]) => {
      console.log('Banner Image ID:', bannerImageId); // Log the returned banner image ID
      console.log('Profile Image ID:', profileImageId); // Log the returned profile image ID
      res.json({ bannerImageId, profileImageId });
    })
    .catch((err) => {
      console.error('Error uploading images:', err); // Catch and log any error during the upload
      res.status(500).json({ message: 'Error uploading images' });
    });
});

// Define a route for the root path ("/")
app.get('/', (req, res) => {
  res.send('Backend is working');
});

// API Routes for reviews
app.use('/api/reviews', reviewRouter);
app.use('/api/auth', authRoutes);
app.use('/api/forget', forgetPas);
app.use('/api/user', userInfo);

// Socket.IO setup for real-time chat
io.on('connection', (socket) => {
  console.log('a user connected');
  
  // Listen for incoming messages from clients
  socket.on('chat message', (msg) => {
    console.log('Message received:', msg);
    io.emit('chat message', msg); // Broadcast the message to all connected clients
  });

  // Listen for user typing events (optional)
  socket.on('typing', (username) => {
    socket.broadcast.emit('typing', username); // Notify others when someone is typing
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err.message);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// Start the server with Socket.IO
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Handle uncaught errors globally
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1); // Exit the process in case of uncaught exception
});

// Graceful shutdown (Optional, for production)
process.on('SIGTERM', () => {
  console.log('SIGTERM received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
