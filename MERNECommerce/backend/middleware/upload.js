// middleware/upload.js
const multer = require('multer');
const path = require('path');

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Folder where images will be stored
  },
  filename: function (req, file, cb) {
    // Unique filename: timestamp + original name
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// File filter (optional, only accept images)
const fileFilter = (req, file, cb) => {
  if (!file) {
    cb(null, true);
    return;
  }

  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(null, false); // ❗ do NOT throw error
  }
};


const upload = multer({ storage, fileFilter });

module.exports = upload;
