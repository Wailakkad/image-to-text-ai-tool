const Users = require("../../database/Users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const Login  = async (req, res) => {
    const {email, password} = req.body;
    if(!email, !password){
        return res.status(400).json({error : "Please fill all the fields"})
       }
    try{
        const user = await Users.findOne({email : email});
        if(!user){
            return res.status(400).json({error : "Invalid Credentials"})
        }else{
            const checkpaswwrod = await bcrypt.compare(password, user.password);
            if(!checkpaswwrod){
                return res.status(400).json({error : "Invalid Credentials"})
            }else{
                const token = jwt.sign({_id : user._id}, process.env.JWT_SECRET);
                res.cookie("jwtoken", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
                    maxAge: 24 * 60 * 60 * 1000,
                  });
                res.status(200).json({message : "User login successfully"})
             }
        }

    }catch(err){
        console.log("Error : " , err)
    }
}

const Register = async (req, res) => {
    const { username, email, password } = req.body;
  
    // Validate input
    if (!username || !email || !password) {
      return res.status(422).json({ error: "Please fill all the fields" });
    }
    try {
      // Check if user already exists
      const user = await Users.findOne({ email: email });
      if (user) {
        return res.status(422).json({ error: "User already exists" });
      }
  
      // Hash password
      const HashPassword = await bcrypt.hash(password, 12);
  
      // Create new user
      const newUser = new Users({
        username,
        email,
        password: HashPassword,
      });
  
      // Save user to database
      await newUser.save();
      console.log("User saved successfully:", newUser);
  
      // Generate JWT token
      const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET);
  
      // Set cookie
      res.cookie("jwtoken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });
  
      // Send success response
      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      console.log("Error:", err);
  
      // Handle duplicate key error
      if (err.code === 11000) {
        return res.status(422).json({ error: "User already exists" });
      }
  
      // Handle other errors
      res.status(500).json({ error: "Internal server error" });
    }
  };
const logout = async (req, res) => {
    try{
        res.cleaarCookie("jwtoken" , {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        });
        res.status(200).json({message : "User logout successfully"})

    }catch(err){
        console.log("Error : " , err)
    }
}


module.exports = {Login, Register, logout};
