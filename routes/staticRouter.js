// routes\staticRouter.js
const express = require("express");
const router = express.Router();
const URL = require("../models/url");

// Middleware to check if user is logged in
router.get("/", async (req, res) => {
    try {
        if (!req.user) {
            return res.redirect("/signup");
        }

        // Fetch all URLs created by the user
        const allurls = await URL.find({ createdBy: req.user.id });

        res.render("home", { urls: allurls, host: req.get('host')
         });
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

// Render signup page if user is not logged in
router.get('/signup', (req, res) => {
    if (req.user) {
        // If user is already logged in, redirect to home page
        return res.redirect('/');
    }
    return res.render('signup');
});

// Render login page if user is not logged in
router.get('/login', (req, res) => {
    if (req.user) {
        // If user is already logged in, redirect to home page
        return res.redirect('/');
    }
    return res.render('login');
});

module.exports = router;



