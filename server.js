const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const USERS_FILE = './users.json';

// Function to read users from JSON file
const readUsers = () => {
    if (fs.existsSync(USERS_FILE)) {
        const data = fs.readFileSync(USERS_FILE);
        return JSON.parse(data);
    }
    return {};
};

// Function to write users to JSON file
const writeUsers = (users) => {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 4));
};

// Handle signup requests
app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    const users = readUsers();

    if (users[username]) {
        return res.json({ success: false, message: 'User already exists!' });
    }

    users[username] = { password };
    writeUsers(users);
    res.json({ success: true, message: 'Signup successful!' });
});

// Handle login requests
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = readUsers();

    if (users[username] && users[username].password === password) {
        res.json({ success: true, message: 'Login successful!' });
    } else {
        res.json({ success: false, message: 'Invalid username or password!' });
    }
});

// Serve the static files (HTML, CSS, JS)
app.use(express.static(__dirname));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});