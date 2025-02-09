const User = require('../models/user');
const {v4: uuidv4} = require('uuid');
const {setUser} = require('../service/auth');

async function handleUserSignup(req, res) {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.render("signup", { error: "All fields are required" });
    }
    if(await User.findOne({email})){
        return res.render("signup", { error: "Email already exists" });
    }
    const user = await User.create({ name, email, password });
    const token = setUser(user);
    res.cookie("uid", token);
    return res.redirect("/");
}

async function handleUserLogin(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    
    if (!user) {
        return res.render("login", { error: "Invalid email or password" });
    }
    const token = setUser(user);
    res.cookie("uid", token);
    return res.redirect("/");
}

async function handleUserLogout(req, res) {
    res.clearCookie('uid'); // Remove the JWT cookie
    return res.redirect('/login'); // Redirect to login page
}

module.exports = {
    handleUserSignup,
    handleUserLogin,
    handleUserLogout,
};
