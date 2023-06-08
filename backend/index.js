const connectToMongo = require('./db'); // Importing the function to connect to MongoDB
const express = require('express'); // Importing Express framework

var cors = require('cors')

connectToMongo(); // Connect to MongoDB

const app = express(); // Create an Express app
const port = 5000; // Specify the port on which the app will listen

app.use(cors())

app.use(express.json()); // Parse JSON bodies automatically

app.use('/api/auth', require('./routes/auth')); // Mount the authentication routes under '/api/auth'
app.use('/api/notes', require('./routes/notes')); // Mount the notes routes under '/api/notes'

app.listen(port, () => {
    console.log(`iNotebook app listening at http://localhost:${port}`); // Start the app and listen for incoming requests
});
