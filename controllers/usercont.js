const userModel = require("../models/usermodel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register callback
const registerController = async (req, res) => {
    try {
        // Validate request data here (e.g., email format, password strength)
        
        const existingUser = await userModel.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(200).send({ message: 'User Already Exists', success: false });
        }

        const password = req.body.password;  // Update this line
         console.log(req.body.email)
        if (!password) {
            return res.status(400).send({ message: 'Password is required', success: false });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;

        const newUser = new userModel(req.body);
        await newUser.save();

        res.status(201).send({ message: 'Registered Successfully', success: true });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: `Register controller error: ${error.message}` });
    }
}

// Login callback 
const loginController = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(200).send({ message: 'User not found', success: false });
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(200).send({ message: 'Invalid Email or Password', success: false });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        console.log(token);

        res.status(200).send({ message: 'Login Success', success: true, token: token });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: `Login controller error: ${error.message}`, success: false });
    }
};

module.exports = {  loginController ,registerController};
