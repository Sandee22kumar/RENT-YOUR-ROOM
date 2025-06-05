var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');

var app = express();
var port = 5508; // Make sure this matches your front-end action URL

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

// Serve static files like your CSS, images (this will serve the HTML page)
app.use(express.static('public'));

//Route to check availability of a room
// app.get('/check.html?room=101', function (req, res) 
// {
//     var room = req.query.room; // Get room from query string
//     if (!room) {
//         return res.status(400).send('Room is required');
//     }

    app.post('/submit', (req, res) => {
        const { first_name, last_name, email, room, contact, address } = req.body;
    

    var checkRoomQuery = 'SELECT * FROM book1 WHERE room = ?';
    db.query(checkRoomQuery, [room], (err, result) => {
        if (err) {
            console.error('Error checking room availability: ' + err.stack);
            return res.status(500).send('There was an error checking room availability!');
        }

        if (result.length > 0) {
            return res.json({ available: false, message: 'Sorry, this room is already booked.' });
        }

        res.json({ available: true, message: 'This room is available for booking.' });
    });
});


// Route to handle form submission for booking
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
 
