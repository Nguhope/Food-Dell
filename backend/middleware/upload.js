// middleware/upload.js
import multer from 'multer';
import path from 'path';

// Storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');  // Define the folder for uploaded images (make sure it exists)
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);  // Naming convention for files
  }
});

// Set up multer upload with storage and optional file filter (image types)
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Error: Only image files are allowed!'));
    }
  }
}).single('image');  // Use 'image' as the field name in your form

export default upload;
