// Importing required packages
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');

// Initialize the app
const app = express();
const port = 5504;

// Middleware to parse incoming JSON and form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MySQL database connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',          // Your MySQL username
    password: 'sandeep@123',          // Your MySQL password (if any)
    database: 'project'  // Your MySQL database name
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Could not connect to the database:', err);
        process.exit(1);  // Exit the application if connection fails
    }
    console.log('Connected to MySQL database');
});

app.get('/pop.html', function (req, res) {
    res.sendFile(__dirname + '/pop.html');  // Fixed the missing '/' in the path
});
// POST request handler for login
app.post('/submit', (req, res) => {
    // Extract data from the form submission
    const { username, password } = req.body;
    console.log(req.body);

    // Query to check if the username and password match 
    const query = 'SELECT * FROM contact2 WHERE userid = ? AND pass = ?';

    db.query(query, [username, password], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Server error');
        }

        if (result.length > 0) {
            // If user found, send a success message
        res.redirect('http://127.0.0.1:5500/index.html');
            
        } else {
            // If no matching user found, send an error message
            res.status(401).send('Invalid username or password');
           // res.redirect('http://127.0.0.1:5500/index.html');

        }


        
    });

    // app.get('/index.html', (req, res) => {
    //     if (!req.session.user) {
    //       // If user is not logged in, redirect to login page
    //       return res.redirect('/login');
    //     }
    // });
    
    app.get('/', (req, res) => {
        // Serve the index.html file when accessing the root URL
        res.sendFile((__dirname, '/index.html'));
      });
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
