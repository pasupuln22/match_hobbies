// Import express.js
const express = require("express");

// Create express app
var app = express();

// Add static files location
app.use(express.static("static"));
// Use the Pug templating engine
app.set('view engine', 'pug');
app.set('views', './app/views');

// Get the functions in the db.js file to use
const db = require('./services/db');

app.get("/", function (req, res) {
    const sql = 'SELECT * FROM interests';

    db.query(sql)
        .then(results => {
            res.render('index', { title: 'Interests', data: results });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

app.get("/details/:id", function (req, res) {
    const s_no = req.params.id;
    const sql = `SELECT * FROM interests WHERE s_no = ${s_no}`;

    db.query(sql)
        .then(results => {
            res.render('details', { title: 'Interests', data: results });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


// Start server on port 3000
app.listen(3000, function () {
    console.log(`Server running at http://127.0.0.1:3000/`);
});