// This is an EXAMPLE backend file using Node.js, Express, and Multer.
// It is not part of the runnable frontend application but demonstrates
// how a file upload endpoint would be implemented.

// To run this in a real Node.js environment:
// 1. Install dependencies: `npm install express multer cors`
// 2. Run the server: `node backend_example.js`
// 3. Ensure the frontend `fetch` request in FileUpload.tsx points to `http://localhost:3001/upload`.

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors'); // For local development

const app = express();
const PORT = 3001;

// --- Multer Configuration ---

// Create the uploads directory if it doesn't exist
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Set up storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Save files to the 'uploads' directory
    },
    filename: (req, file, cb) => {
        // Create a unique filename to avoid overwriting
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
    fileFilter: (req, file, cb) => {
        // Accept images and videos
        const filetypes = /jpeg|jpg|png|webp|mp4/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Error: File upload only supports the following filetypes - ' + filetypes));
    }
}).single('media'); // 'media' is the field name in the FormData

// --- Middleware ---
app.use(cors()); // Enable CORS for all routes, essential for local dev
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files from the uploads directory

// --- Routes ---
app.get('/', (req, res) => {
    res.send('File upload server is running.');
});

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            // A Multer error occurred (e.g., file size limit, invalid file type)
            console.error('Multer Error:', err.message);
            return res.status(400).json({ message: err.message });
        }
        if (!req.file) {
            // No file was uploaded
            return res.status(400).json({ message: 'Please upload a file.' });
        }

        // File was successfully uploaded
        console.log('File uploaded successfully:', req.file);
        
        // Return the path to the file. In a production app, you might return a full URL
        // e.g., `http://${req.get('host')}/uploads/${req.file.filename}`
        res.status(200).json({
            message: 'File uploaded successfully!',
            filePath: `/uploads/${req.file.filename}`
        });
    });
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
    console.log(`Uploaded files will be available at http://localhost:${PORT}/uploads/[filename]`);
});
