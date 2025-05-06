const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const ImageUploadvalidator = require("../../middleware/imageUploadValidator");
const router = express.Router();

// Directory to store uploaded images
const imageDir = '/var/www/html/images';

// Ensure the upload directory exists, create it if not
if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
}

// Define allowed file extensions and maximum file size (e.g., 5MB)
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif','.webp','.jfif'];
const maxFileSize = 2 * 1024 * 1024; // 2MB

// Multer file filter function to limit file types
const fileFilter = (req, file, cb) => {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
        return cb(new Error("Invalid file type. Only images are allowed."), false);
    }
    
    cb(null, true);
};

// Set up storage engine for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, imageDir); // Define the folder to store files
    },
    filename: function (req, file, cb) {
        // Sanitize the filename to avoid directory traversal or dangerous characters
        const sanitizedFilename = uuidv4() + path.extname(file.originalname).toLowerCase();
        cb(null, sanitizedFilename);
    }
});

// Initialize multer with file filter and size limit
const upload = multer({
    storage: storage,
    limits: { fileSize: maxFileSize }, // Limit file size to 5MB
    fileFilter: fileFilter // Apply file type filter
});

// Handle image upload POST request
router.post('/upload', upload.single('image'),ImageUploadvalidator, (req, res) => {
    try {
        if (req.file) {
            const uploadedFileName = req.file.filename;
            res.status(200).send({ success:true,message:"Uploaded successfully", filename: uploadedFileName });
        } else {
            res.status(400).send({success:true,message:'No file uploaded'});
        }
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).send({success:true,message:'Error uploading image'});
    }
});

// // Error handling for multer file validation
// router.use((err, req, res, next) => {
//     if (err instanceof multer.MulterError) {
//         // Handle specific Multer errors
//         if (err.code === 'LIMIT_FILE_SIZE') {
//             return res.status(400).send('File size exceeds the limit');
//         }
//         return res.status(400).send('Error with file upload');
//     } else if (err) {
//         // Handle other errors (e.g., file type validation error)
//         return res.status(400).send(err.message || 'Unknown error');
//     }
//     next();
// });

module.exports = router;
