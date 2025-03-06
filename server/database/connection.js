const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Add connection options for better stability
    await mongoose.connect(process.env.MONGO_URI, {
     
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });

    console.log('MongoDB connected to database:', mongoose.connection.name);
  } catch (err) {
    console.error('Mongo_Error:', err);
    process.exit(1); // Exit the process if the connection fails
  }
};

module.exports = connectDB;