const jwt = require('jsonwebtoken'); // Importing the jsonwebtoken package for token verification
const JWT_SECRET = "ansarisgoodb$oy"; // Secret key used for token generation and verification
const fetchuser= (req, res, next) => {
    // Get the user from jwt token and add id to req object
    const token = req.header('auth-token'); // Extract the token from the request headers
    if(!token){
        res.status(401).send({error: "Please authenticate using a valid token"}); // If token is missing, send an error response
    }
    try {
        const data = jwt.verify(token, JWT_SECRET); // Verify the token using the secret key
        req.user = data.user; // Extract the user ID from the decoded token and add it to the req object
        next(); // Call the next middleware or route handler
    } catch (error) {
        res.status(401).send({error: "Please authenticate using a valid token"}); // If token verification fails, send an error response
    }
}
module.exports = fetchuser; // Export the fetchuser middleware for use in other modules
