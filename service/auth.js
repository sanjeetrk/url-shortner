// service\auth.js
const jwt = require("jsonwebtoken");
const secret = "Sanjeet123@";

// Set the user token by signing the user's information
function setUser(user) {
    const payload = { id: user._id, email:user.email }; // You can add other details as needed
    return jwt.sign(payload, secret, { expiresIn: '30d' }); // Expiry time can be adjusted
}

// Get the user information by verifying the JWT token
function getUser(token) {
    if (!token) {
        return null;
    }
    try {
        return jwt.verify(token, secret); // Verifies and decodes the token
    } catch (error) {
        return null;
    }
}

module.exports = {
    setUser,
    getUser,
};
