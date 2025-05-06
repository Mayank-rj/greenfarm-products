const multer = require("multer");

const ImageUploadvalidator = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Handle specific Multer errors
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).send({success:false,message:'File size exceeds the limit'});
        }
        return res.status(400).send({success:false,message:'Error with file upload'});
    } else if (err) {
        // Handle other errors (e.g., file type validation error)
        return res.status(400).send(err.message || 'Unknown error');
    }
    next();
}
module.exports = ImageUploadvalidator;
