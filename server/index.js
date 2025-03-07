require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); 
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const analyzeRoutes = require("./routes/analyzeRoutes");
const connectDB = require("./database/connection");
const authRouter = require("./routes/UsersRoute/userRoute");
const textToImageRoutes = require("./routes/Text-to-image");
const Hashtags = require("./routes/Hashtags");

const app = express();


app.use(bodyParser.json());
app.use(cors()); 

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});


const upload = multer({ storage });

// Create uploads directory for storing generated images
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from the uploads directory
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use("/api", analyzeRoutes);
app.use("/api", authRouter);
app.use("/api", textToImageRoutes);
app.use("/api", Hashtags);

const PORT = process.env.PORT || 5000;
connectDB();
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});