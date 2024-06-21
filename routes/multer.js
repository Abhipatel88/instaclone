const multer = require("multer");  // Multer is a popular Node.js middleware for handling multipart/form-data, which         is primarily used for uploading files. It's a widely-used library that makes it easy to                                  handle file uploads in Node.js applications
const path = require("path");
const crypto = require("crypto");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/uploads");  // path for storage
  },
  filename: function (req, file, cb) {
    const fn =
      crypto.randomBytes(16).toString("hex") + path.extname(file.originalname); // file name what 
    cb(null, fn);
  },
});

const upload = multer({ storage: storage });
module.exports = upload;  // for use in different files