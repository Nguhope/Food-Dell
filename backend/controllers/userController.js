import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";


// Create Token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "3d" });
};

// ✅ Login User (Fixed)
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log("🔍 Login Attempt:", email); // ✅ Debug log

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            console.log("❌ User does not exist:", email);
            return res.status(404).json({ success: false, message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("❌ Password mismatch for:", email);
            return res.status(401).json({ success: false, message: "Invalid Credentials" });
        }

        console.log("✅ Login successful for:", email);
        const token = createToken(user._id);
        res.status(200).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email } });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ success: false, message: "Error logging in" });
    }
};


// ✅ Register User (Fixed)
const registerUser = async (req, res) => {
    const { name, password, email } = req.body;

    try {
        // **Check if user already exists** (Fix)
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "User already exists. Please log in instead." });
        }

        // Validate email
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email format" });
        }

        // Strong password check
        if (!validator.isStrongPassword(password, { minLength: 8, minNumbers: 1, minUppercase: 1 })) {
            return res.json({ success: false, message: "Weak password. Must contain 8+ characters, a number, and an uppercase letter." });
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({ name, email, password: hashedPassword });

        // Save User & Generate Token
        const user = await newUser.save();
        const token = createToken(user._id);

        res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email } });

    } catch (error) {
        console.error("Registration Error:", error);
        res.json({ success: false, message: "Error registering user" });
    }
};

export { loginUser, registerUser };
