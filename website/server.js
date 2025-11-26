const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'submissions.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize submissions file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

// Helper function to read submissions
function readSubmissions() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading submissions:', error);
        return [];
    }
}

// Helper function to write submissions
function writeSubmissions(submissions) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(submissions, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing submissions:', error);
        return false;
    }
}

// API Route: Handle contact form submission
app.post('/api/contact', (req, res) => {
    try {
        const { name, email, message, timestamp } = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'All fields (name, email, message) are required.'
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address.'
            });
        }

        // Name validation
        if (name.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Name must be at least 2 characters long.'
            });
        }

        // Message validation
        if (message.trim().length < 10) {
            return res.status(400).json({
                success: false,
                message: 'Message must be at least 10 characters long.'
            });
        }

        // Read existing submissions
        const submissions = readSubmissions();

        // Create new submission
        const newSubmission = {
            id: Date.now().toString(),
            name: name.trim(),
            email: email.trim(),
            message: message.trim(),
            timestamp: timestamp || new Date().toISOString(),
            status: 'new'
        };

        // Add to submissions
        submissions.push(newSubmission);

        // Write back to file
        if (writeSubmissions(submissions)) {
            console.log(`New submission received from ${name} (${email})`);
            res.status(200).json({
                success: true,
                message: 'Your message has been received successfully!',
                submissionId: newSubmission.id
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to save your message. Please try again later.'
            });
        }
    } catch (error) {
        console.error('Error processing contact form:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while processing your request. Please try again later.'
        });
    }
});

// API Route: Get all submissions (for admin purposes - optional)
app.get('/api/submissions', (req, res) => {
    try {
        const submissions = readSubmissions();
        res.status(200).json({
            success: true,
            count: submissions.length,
            submissions: submissions
        });
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch submissions.'
        });
    }
});

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📝 Contact form submissions will be stored in: ${DATA_FILE}`);
});

