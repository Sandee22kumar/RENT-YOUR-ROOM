var express = require('express');
var mysql = require('mysql');
var path = require('path');

var app = express();
var port = 5501;

// Middleware for parsing JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS) from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// MySQL connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // your MySQL username
    password: 'sandeep@123',  // your MySQL password
    database: 'project'
});

// Establishing the MySQL connection
db.connect((err) => {
    if (err) {
        console.error('Could not connect to the database:', err);
        process.exit(1); // Exit if the connection fails
    }
    console.log('Connected to MySQL database');
});

// Serve the contact page (Ensure 'contact.html' is in the 'public' folder)
app.get('/contact.html', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));  // Serve the contact form page
});

// POST request handler for form submission
app.post('/submit', function (req, res) {
    // Log the request body to see if the values are coming through
    console.log(req.body);  // This will display the submitted data in the console

    // Get the data from the request body
    var { userid, fname, lname, eml, pass, mbl, gender, state, address } = req.body;

    // SQL query to insert data into the 'contact2' table
    var query = `INSERT INTO contact2 (userid, fname, lname, eml, pass, mbl, gender, state, address)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(query, [userid, fname, lname, eml, pass, mbl, gender, state, address], function (err) {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).send('Error inserting data');
        }

        // Redirect to the 'index.html' after successful form submission
        res.redirect('http://127.0.0.1:5500/pop.html');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
