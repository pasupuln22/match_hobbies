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

// profile route
app.get('/profile', async function (req, res) {
    const userId = req.session.uid;
    const sql = 'SELECT * FROM Users WHERE id = ?';
    try {
        const user = await db.query(sql, [userId]);
        // Assuming that user[0] contains the user data, adjust accordingly if needed
        res.render('profile', { data: user, loggedIn: req.session.loggedIn, currentPage: 'profile' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




app.get('/create-hobby', async function (req, res) {
    const userId = req.session.uid;
    const sql = 'SELECT * FROM all_hobbies';
    try {
        const hobbies = await db.query(sql);
        res.render('create-hobby', { userId, loggedIn: req.session.loggedIn, hobbies,currentPage: 'create-hobby' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/edit-hobby/:id', async function (req, res) {
    hobbyId = req.params.id;
    const sql = 'SELECT * FROM all_hobbies';
    try {
        const hobbies = await db.query(sql);
        res.render('edit-hobby',{ hobbyId ,hobbies, loggedIn: req.session.loggedIn, currentPage: 'own-hobby'})
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Create a route for root - /
app.get("/", function(req, res) {
    if (req.session.uid) {   
        res.send('Welcome back, ' + req.session.uid + '!');
    } else {
        res.render('login', { loggedIn: req.session.loggedIn });
    }
    res.end();
});

// Create a route for hobbies API
app.get("/own-hobby", async function (req, res) {
    const createdBy = req.session.uid;

    try {
        const userHobbies = await Hobby.getHobbiesByUser(createdBy);
        res.render('own-hobby', { data: userHobbies , loggedIn: req.session.loggedIn, currentPage: 'own-hobby'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get("/details/:hobbyId", async function (req, res) {
    const hobbyId = req.params.hobbyId;
    try {
        const hobby = await Hobby.getHobbyById(hobbyId);
        console.log(hobby);
        res.render('details', { data: hobby , loggedIn: req.session.loggedIn, currentPage: 'home'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post("/create-hobby/:createdBy", async function (req, res) {
    const createdBy = req.params.createdBy;
    const { hobbies, location } = req.body;

    try {
        const newHobby = new Hobby(hobbies, location, createdBy);
        await newHobby.createHobby();
        res.render('create-hobby', { userId: createdBy,oggedIn: req.session.loggedIn, successMessage: 'Hobby created successfully' });
    } catch (error) {
        console.error(error);
        res.render('create-hobby', { userId: createdBy,oggedIn: req.session.loggedIn, errorMessage: 'Internal Server Error' });
    }
});

// Update Hobby route
app.post("/update-hobby/:hobbyId", async function (req, res) {
    const hobbyId = req.params.hobbyId;
    const { hobbies, location } = req.body;

    try {
        const hobbyToUpdate = new Hobby(hobbies, location, null);
        hobbyToUpdate.id = hobbyId;
        await hobbyToUpdate.updateHobby();
        res.render('edit-hobby', { successMessage: `Hobby ${hobbyId} updated successfully`,oggedIn: req.session.loggedIn, hobbyId });
    } catch (error) {
        console.error(error);
        res.render('edit-hobby', { errorMessage: 'Internal Server Error',oggedIn: req.session.loggedIn, hobbyId });
    }
});


app.get("/delete-hobby/:hobbyId", async function (req, res) {
    const hobbyId = req.params.hobbyId;
    try {
        await Hobby.deleteHobby(hobbyId);
        // res.json({ success: true });
        res.render('edit-hobby', { successMessage: `Hobby ${hobbyId} deleted successfully`, hobbyId , loggedIn: req.session.loggedIn, currentPage: 'own-hobby'});
    } catch (error) {
        console.error(error);
        res.render('edit-hobby', { errorMessage: 'Internal Server Error', loggedIn: req.session.loggedIn, hobbyId });
    }
});

app.get("/home", function (req, res) {
    const sql = 'SELECT hobbies.*,Users.email as user FROM hobbies,Users WHERE hobbies.created_by = Users.id;';
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
    const params = req.body; // Declare as const
    const user = new User(params.email);

    try {
        const uId = await user.getIdFromEmail();
        if (uId) {
            await user.setUserPassword(params.password);
            console.log(req.session.id);
            res.render('register', { successMessage: 'Password set successfully', loggedIn: req.session.loggedIn });
        } else {
            const newId = await user.addUser(params.email);
            res.render('register', { successMessage: 'Account created successfully', loggedIn: req.session.loggedIn });
        }
    } catch (err) {
        console.error(`Error while setting password `, err.message);
        res.render('register', { errorMessage: 'An error occurred while setting the password', loggedIn: req.session.loggedIn });
    }
});

// Check submitted email and password pair
app.post('/authenticate', async function (req, res) {
    const params = req.body; // Declare as const
    const user = new User(params.email);
    
    try {
        const uId = await user.getIdFromEmail();
        if (uId) {
            const match = await user.authenticate(params.password);
            console.log(match);
            if (match) {
                req.session.uid = uId;
                req.session.loggedIn = true;
                console.log(req.session.id);
                res.redirect('/home');
            } else {
                res.render('login', { errorMessage: 'Invalid password' });
            }
        } else {
            res.send('Invalid email');
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
