const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const app = express();

// Allow requests from different domains
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/express', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define schema for "equipes" collection
const equipeSchema = new mongoose.Schema({
    id: Number,
    name: String,
    country: String
});

// Create model based on schema
const Equipe = mongoose.model('equipes', equipeSchema);

// Middleware to verify JWT token
function verifyToken(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        console.log('authHeader:', token);
        const decoded = jwt.verify(token.split(' ')[1], 'your_secret_key');
        console.log('token:', token.split(' ')[1]);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token' });
    }
}

// Route to generate JWT token (fake login)

app.post('/login', (req, res) => {
    const user = {
        id: 1,
        username: 'Oussama Youssef'
    };

    // Generate JWT token using the same secret key
    jwt.sign({ user: user }, 'your_secret_key', { expiresIn: '1h' }, (err, token) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to generate token' });
        }
        res.json({ token: token });
    });
});

// Protected route to get data from "equipes" collection

app.get('/equipes', verifyToken, async (req, res) => {
    try {
        // Retrieve data from "equipes" collection
        const equipes = await Equipe.find({});
        res.status(200).json(equipes);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Start server


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

