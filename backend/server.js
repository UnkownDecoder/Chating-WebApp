// server.js or app.js

const express = require('express');
const mongoose = require('mongoose');
const gridfs = require('gridfs-stream');
const multer = require('multer');
const dotenv = require('dotenv');
const authRoutes = require('./routers/authRoutes');
const forgetPas = require('./routers/forgetPassword');
const reviewRouter = require('./routers/reviewRouter');
const cors = require('cors');
const bodyParser = require('body-parser');

dotenv.config(); // Load environment variables from .env file

const app = express();

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

// Middleware to parse JSON
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

// API endpoint to upload images
app.post('/upload', upload.fields([{ name: 'bannerImage' }, { name: 'profileImage' }]), (req, res) => {
  const files = req.files;
  const bannerImage = files.bannerImage ? files.bannerImage[0] : null;
  const profileImage = files.profileImage ? files.profileImage[0] : null;

  const uploadImage = (file) => {
    return new Promise((resolve, reject) => {
      const writeStream = gfs.createWriteStream({
        filename: file.originalname,
        content_type: file.mimetype
      });
      writeStream.write(file.buffer);
      writeStream.end();
      writeStream.on('finish', () => resolve(writeStream.id));
      writeStream.on('error', reject);
    });
  };

  Promise.all([bannerImage ? uploadImage(bannerImage) : null, profileImage ? uploadImage(profileImage) : null])
    .then(([bannerImageId, profileImageId]) => {
      res.json({ bannerImageId, profileImageId });
    })
    .catch(err => {
      console.error('Error uploading images:', err);
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


app.use((err, req, res, next) => {
  console.error('Global error handler:', err.message);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
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




