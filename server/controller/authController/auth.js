const User = require("../authController/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const Login  = async (req, res) => {
    const {email, password} = req.body;
    if(!email, !password){
        return res.status(400).json({error : "Please fill all the fields"})
       }
    try{
        const user = await User.findOne({email : email});
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

const Register  = async (req, res) => {
    const {name, email, password} = req.body;
    if(!name || !email || !password){
        return res.status(422).json({error : "Please fill all the fields"})
    }
    try{
        const user = await User.findOne({email : email});
        if(user){
            return res.status(422).json({error : "User already exists"})
        }
        const HashPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            name,
            email,
            password : HashPassword
        });
        await newUser.save();
        const token = jwt.sign({_id : newUser._id}, process.env.JWT_SECRET);
        res.cookie("jwtoken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 24 * 60 * 60 * 1000,
          });
        res.status(201).json({message : "User registered successfully"})

    }catch(err){
        console.log("Error : " , err)
    }
}
const logout = async (req, res) => {
    try{

    }catch(err){
        console.log("Error : " , err)
    }
}


module.exports = {Login, Register};