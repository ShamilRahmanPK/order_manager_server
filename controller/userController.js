const users = require("../model/userModel");
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt");


exports.registerController = async (req, res) => {
    console.log("Inside registerController");
    const { email, username, password } = req.body;
    console.log(email, username, password);

    try {
        const existingUser = await users.findOne({ email });

        if (existingUser) {
            return res.status(406).json("User Already exists. Please login.");
        }

        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password, salt); 

        const newUser = new users({
            email,
            username,
            password: hashedPassword, 
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error("Error in registerController:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};


// login
exports.loginController = async (req, res) => {
    console.log("loginController");
    const { email, password } = req.body;
    console.log(email, password);

    try {
        const existingUser = await users.findOne({ email });
        if (existingUser) {
            const isMatch = await bcrypt.compare(password, existingUser.password);
            if (!isMatch) {
                return res.status(404).json("Invalid Email or Password");
            }
            const token = jwt.sign({ userId: existingUser._id }, process.env.JWTPASSWORD);
            res.status(200).json({ user: existingUser, token });
        } else {
            res.status(404).json("Invalid Email or Password");
        }
    } catch (err) {
        res.status(401).json("request received");
    }
};
