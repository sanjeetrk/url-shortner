// middlewares\auth.js
const { getUser } = require('../service/auth'); // Ensure this path is correct

// Middleware to restrict access to logged-in users
function restrictToLoggedInUserOnly(req, res, next) {
    const userUid = req.cookies.uid;

    if (!userUid) {
        return res.redirect('/login');  // No cookie, user not logged in
    }

    const user = getUser(userUid); 
  

    if (!user) {
        return res.redirect('/login');  // Invalid or expired token
    }

    req.user = user;  // Attach user to the request object
    next();  // Proceed to next middleware or route handler
}

// Middleware to check if a user is logged in (does not restrict access)
function checkAuth(req, res, next) {
    const userUid = req.cookies.uid;

    if (userUid) {
        const user = getUser(userUid);  // Verify user from the token

        if (user) {
            req.user = user;  // Attach user to the request object
        }
    }

    next();  // Proceed to next middleware or route handler
}

module.exports = {
    restrictToLoggedInUserOnly,
    checkAuth
};
