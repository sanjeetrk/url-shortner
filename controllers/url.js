// controllers\url.js

const shortid = require('shortid');
const URL = require('../models/url');

async function handleGeneratNewShortURL(req, res) {
    const body = req.body;
    if (!body.url) {
        return res.status(400).json({ error: "URL is required" });
    }

    try {
        // Check if the URL already exists in the database for the current user
        let existingEntry = await URL.findOne({ 
            redirectUrl: body.url, 
            createdBy: req.user.id // Ensure the URL belongs to the current user
        });

        if (existingEntry) {
            // If the URL exists for the current user, render home with all their URLs
            const allURLs = await URL.find({ createdBy: req.user.id });
            return res.render("home", { id: existingEntry.shortid, urls: allURLs , host: req.get('host') });
        }

        // If URL does not exist, create a new short URL for the user
        const shortID = shortid.generate();
        await URL.create({
            shortid: shortID,
            redirectUrl: body.url,
            visitHistory: [],
            createdBy: req.user.id,
        });

        // Fetch all URLs created by the user after creation
        const allURLs = await URL.find({ createdBy: req.user.id });
        return res.render("home", { id: shortID, urls: allURLs , host: req.get('host') });


  

    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
}



async function handleGetURLAnalytics(req, res) {
    const shortid = req.params.shortid;
    const result = await URL.findOne({ shortid: shortid });

    if (!result) {
        return res.status(404).json({ error: "Short URL not found" });
    }

    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory
    });
}

async function handleDeleteURL(req, res) {
    const shortid = req.params.shortid;
    const action = req.body.action;

    // Ensure that the action is "delete"
    if (action !== "delete") {
        return res.status(400).json({ error: "Invalid action" });
    }

    try {
        await URL.deleteOne({ shortid: shortid, createdBy: req.user.id });
        res.redirect('/');
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
}


module.exports = {
    handleGeneratNewShortURL,
    handleGetURLAnalytics,
    handleDeleteURL
};



