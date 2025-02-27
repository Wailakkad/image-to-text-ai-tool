require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); 
const analyzeRoutes = require("./routes/analyzeRoutes");
const connectDB = require("./database/connection");
const authRouter = require("./routes/UsersRoute/userRoute")

const app = express();


app.use(bodyParser.json());
app.use(cors()); 



// Routes
app.use("/api", analyzeRoutes);
app.use("/api", authRouter);



const PORT = process.env.PORT || 5000;
connectDB();
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});