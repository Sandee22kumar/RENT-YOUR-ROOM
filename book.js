var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');

var app = express();
var port = 5507;

// MySQL connection configuration
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',   // Change to your MySQL username
    password: 'sandeep@123',   // Change to your MySQL password
    database: 'project'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL as ID ' + db.threadId);
});

// Middleware for parsing POST request data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files like your CSS, images
app.use(express.static('public'));

// Handle the form submission
app.post('/submit', (req, res) => {
    const { first_name, last_name, email, room, contact, address } = req.body;

    // Check if all fields are filled
    if (!first_name || !last_name || !email || !room || !contact || !address) {
        return res.send('All fields are required!');
    }

    // Check if the room is already booked
    var checkRoomQuery = 'SELECT * FROM book1 WHERE room = ?';
    db.query(checkRoomQuery, [room], (err, result) => {
        if (err) {
            console.error('Error checking room availability: ' + err.stack);
            return res.send('There was an error checking room availability!');
        }

        if (result.length > 0) {
            // If result is not empty, room is already booked
            return res.send('Sorry, this room is already booked. Please choose another room.');
        }

        // If room is available, insert the new booking
        var query = 'INSERT INTO book1 (first_name, last_name, email, room, contact, address) VALUES (?, ?, ?, ?, ?, ?)';
        var values = [first_name, last_name, email, room, contact, address];

        db.query(query, values, (err, result) => {
            if (err) {
                console.error('Error inserting data: ' + err.stack);
                return res.send('There was an error processing your booking!');
            }
            res.redirect('http://127.0.0.1:5500/payment1.html');
        });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
