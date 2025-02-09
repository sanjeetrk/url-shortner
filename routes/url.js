// routes\url.js
const express= require("express");
const router= express.Router();
const { handleGeneratNewShortURL ,handleGetURLAnalytics, handleDeleteURL} = require("../controllers/url"); 


router.post("/", handleGeneratNewShortURL);
router.get("/analytics/:shortid", handleGetURLAnalytics);

router.post("/:shortid", handleDeleteURL);

    

module.exports= router;