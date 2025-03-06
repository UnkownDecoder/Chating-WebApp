import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadFolder = "uploads/";
    
    if (file.mimetype.startsWith("image/")) {
      uploadFolder += "images/";
    } else if (file.mimetype.startsWith("video/")) {
      uploadFolder += "videos/";
    } else if (file.mimetype.startsWith("audio/")) {
      uploadFolder += "audio/";
    } else {
      uploadFolder += "documents/";
    }
    
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/png", "image/jpeg", "image/jpg", "image/gif",
    "video/mp4", "video/mkv", "video/webm",
    "audio/mp3", "audio/wav", "audio/mpeg",
    "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];
  
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error("Invalid file type. Only images, videos, audio, and documents are allowed."), false);
  }
  
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // Max file size: 50MB
});

export default upload;
