// index.js
const express = require("express");
const urlRoute = require("./routes/url");
const path = require("path");
const URL = require("./models/url");
const staticRouter = require("./routes/staticRouter");
const userRoute = require('./routes/user');
const cookieParser = require("cookie-parser");
const { restrictToLoggedInUserOnly, checkAuth } = require('./middlewares/auth');


require("./connect");

const app = express();
const PORT = 8001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(cookieParser());

app.use("/url", restrictToLoggedInUserOnly, urlRoute);
app.use("/", checkAuth, staticRouter);
app.use('/user', userRoute);


app.get("/url/:shortid", async (req, res) => {
    const shortid = req.params.shortid;
    const entry = await URL.findOneAndUpdate(
        { shortid: shortid },
        {
            $push: {
                visitHistory: { timestamp: Date.now() }
            }
        },
        { new: true } // Ensures the updated document is returned
    );


    if (!entry) {
        return res.status(404).json({ error: "Short URL not found" });
    }

    res.redirect(entry.redirectUrl);
});








app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`) });







