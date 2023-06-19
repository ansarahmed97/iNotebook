const express = require('express'); // Importing Express framework
const router = express.Router(); // Creating a router object
const User = require('../models/User'); // Importing the User model
const { body, validationResult } = require('express-validator'); // Importing validation functions from express-validator
const bcrypt = require('bcryptjs'); // Importing bcryptjs for password hashing
const jwt = require('jsonwebtoken'); // Importing jsonwebtoken for token generation
const fetchuser = require('../middleware/fetchuser'); // Importing the fetchuser middleware
const JWT_SECRET = "ansarisgoodb$oy"; // Secret key used for token generation

// ROUTE:1 Create a user using: POST "/api/auth/createuser" . Doesn't require login
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }), // Validation check for name field
    body('email', 'Enter a valid email').isEmail(), // Validation check for email field
    body('password', 'Password must be at least 5 characters').isLength({ min: 5 }), // Validation check for password field
], async (req, res) => {
    let success = false;
    // If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }
    try {
        let user = await User.findOne({ email: req.body.email }); // Check if a user with the same email already exists
        if (user) {
            return res.status(400).json({success, error: "A user with this email already exists" })
        }
        const salt = await bcrypt.genSalt(10); // Generate a salt for password hashing
        const secPass = await bcrypt.hash(req.body.password, salt); // Hash the password
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        }); // Create a new user
        const data = {
            user: {
                id: user.id
            }
        };
        // Create a token
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({success, authToken });
    } catch (error) {
        console.error(error.message);
        res.status(500).send( "Some error occurred");
    }
});
// ROUTE:2 Authenticate a user using: POST "/api/auth/login" . Doesn't require login
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(), // Validation check for email field
    body('password', 'Password can not be blank').exists() // Validation check for password field
], async (req, res) => {
    let success = false;
    // If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email }); // Find the user by email
        if (!user) {
            return res.status(400).json({ errors: "Please try to login with correct credentials" });
        }
        const passwordcompare = await bcrypt.compare(password, user.password); // Compare the provided password with the hashed password
        if (!passwordcompare) {
            success = false;
            return res.status(400).json({success, errors: "Please try to login with correct credentials" });
        }
        const data = {
            user: {
                id: user.id
            }
        };
        const authToken = jwt.sign(data, JWT_SECRET); // Create a token
        success = true;
        res.json({ success, authToken });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});
// ROUTE:3 Get logged in user details using: POST "/api/auth/getuser" . Login required
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password"); // Fetch the user details excluding the password
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});
module.exports = router; // Export the router object
