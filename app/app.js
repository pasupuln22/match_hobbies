// Import express.js
const express = require("express");
const session = require("express-session");
const { User } = require("./models/user");
const { Hobby } = require("./models/hobbies");

// Create express app
const app = express();

// Add static files location
app.use(express.static("static"));
// Use the Pug templating engine
app.set('view engine', 'pug');
app.set('views', './app/views');

app.use(express.urlencoded({ extended: true }));

// Get the functions in the db.js file to use
const db = require('./services/db');

const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds

app.use(session({
    secret: 'secretkeysdfjsflyoifasd',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: oneHour // Set the session duration to 1 hour
    }
}));

// Register
app.get('/register', function (req, res) {
    res.render('register');
});

// Login route
app.get('/login', function (req, res) {
    res.render('login', { loggedIn: req.session.loggedIn, currentPage: 'login' });
});


// Create a route for root - /
app.get("/", function(req, res) {
    if (req.session.uid) {   
        res.send('Welcome back, ' + req.session.uid + '!');
    } else {
        // res.send('Please login to view this page!');
        res.render('login', { loggedIn: req.session.loggedIn });
    }
    res.end();
});

// Create a route for hobbies API
app.get("/hobbies/:userId", async function (req, res) {
    const userId = req.params.userId;

    try {
        const userHobbies = await Hobby.getHobbiesByUser(userId);
        res.json(userHobbies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get("/details/:hobbyId", async function (req, res) {
    const hobbyId = req.params.hobbyId;
    try {
        const hobby = await Hobby.getHobbyById(hobbyId);
        console.log(hobby); // Add this line to check the retrieved data
        res.render('details', { data: hobby , loggedIn: req.session.loggedIn, currentPage: 'home'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post("/create-hobby/:userId", async function (req, res) {
    const userId = req.params.userId;
    const { hobbies, location, datetime } = req.body;

    try {
        const newHobby = new Hobby(userId, hobbies, location, datetime);
        await newHobby.createHobby();
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put("/hobbies/:hobbyId", async function (req, res) {
    const hobbyId = req.params.hobbyId;
    const { hobbies, location, datetime } = req.body;

    try {
        const hobbyToUpdate = new Hobby(null, hobbies, location, datetime);
        hobbyToUpdate.id = hobbyId;
        await hobbyToUpdate.updateHobby();
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete("/hobbies/:hobbyId", async function (req, res) {
    const hobbyId = req.params.hobbyId;

    try {
        await Hobby.deleteHobby(hobbyId);
        res.json({ success: true });
        res.render('details', { title: 'hobbies', data: results, loggedIn: req.session.loggedIn });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get("/home", function (req, res) {
    const sql = 'SELECT * FROM hobbies';
    const sql1 = 'SELECT * FROM all_hobbies';

    Promise.all([db.query(sql), db.query(sql1)])
        .then(([result, result1]) => {
            res.render('homepage', { title: 'hobbies', data: result, data1: result1, loggedIn: req.session.loggedIn, currentPage: 'home' });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

app.post('/set-password', async function (req, res) {
    params = req.body;
    var user = new User(params.email);

    try {
        uId = await user.getIdFromEmail();
        if (uId) {
            // If a valid, existing user is found, set the password
            await user.setUserPassword(params.password);
            console.log(req.session.id);
            // Render the same page with success message
            res.render('register', { successMessage: 'Password set successfully', loggedIn: req.session.loggedIn });
        } else {
            // If no existing user is found, add a new one
            newId = await user.addUser(params.email);
            // Render the same page with success message
            res.render('register', { successMessage: 'Account created successfully', loggedIn: req.session.loggedIn });
        }
    } catch (err) {
        console.error(`Error while setting password `, err.message);
        // Render the same page with error message
        res.render('register', { errorMessage: 'An error occurred while setting the password', loggedIn: req.session.loggedIn });
    }
});


// Check submitted email and password pair
app.post('/authenticate', async function (req, res) {
    params = req.body;
    var user = new User(params.email);
    try {
        uId = await user.getIdFromEmail();
        if (uId) {
            match = await user.authenticate(params.password);
            console.log(match)
            if (match) {
                req.session.uid = uId;
                req.session.loggedIn = true;
                console.log(req.session.id);
                res.redirect('/home');
            } else {
                res.render('login', { errorMessage: 'Invalid password' });
            }
        } else {
            res.send('invalid email');
        }
    } catch (err) {
        console.error(`Error while comparing `, err.message);
    }
});

// Logout
app.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/login');
});




// Start server on port 3000
app.listen(3000, function () {
    console.log(`Server running at http://127.0.0.1:3000/`);
});
