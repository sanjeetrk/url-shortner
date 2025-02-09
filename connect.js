// connect.js
require('dotenv').config();
const mangoose = require('mongoose');   
async function connectToMongoDB (url) {

    return await mangoose.connect(url);

}

connectToMongoDB(process.env.MONGO_URL).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log("Error connecting to MongoDB", err);
});

module.exports= connectToMongoDB;