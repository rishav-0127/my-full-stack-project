const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Ensure environment variables are set
if (!process.env.CLOUD_NAME || !process.env.CLOUD_API_KEY|| !process.env.CLOUD_API_SECRET) {
    console.error("Cloudinary environment variables are not set correctly.");
    throw new Error("Cloudinary configuration error.");
}

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

// Set up storage
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'Wanderlust',
        allowed_formats: ['jpeg', 'png', 'jpg']
    }
});

// Log configuration success
console.log("Cloudinary configuration loaded. Uploads will be saved in folder:", 'Wanderlust');

module.exports = {
    cloudinary,
    storage
};
